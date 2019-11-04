/**
 * Author: Gabriel Vande Hei
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import {Subject} from 'rxjs/Subject';
import { Event, Action , FFTBlock, FFTSpectrum} from '../model/types';
import * as socketIo from 'socket.io-client';
import { SettingsService } from 'src/app/settings.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  /**
   * SocketService: provides communication with a rotini-soundnode sound websocket
   */

  private socket: socketIo; //the websocket connection
  private isConnected: boolean;
  private connectionTimeout: number; //timeout id so we can clear it later
  private audioDataFrame: Map<number, number>;
  private deviceNames: string[];
  private audioObserver: Observable<Map<number, number>>;
  private observers: Observer<Map<number, number>>[];

  constructor(){
    this.connectSocket = this.connectSocket.bind(this);
    this.audioDataFrame = new Map<number, number>(); 
    this.observers = [];
    this.audioObserver = new Observable(this.multiCastSequenceSubscriber());
  }

  /**
   * multiCastSequenceSubscriber: subscribes to the audio stream, used to initialize observer
   * @return a callable to unsubscribe from audio stream
   */
  private multiCastSequenceSubscriber(){
    return (observer) => {
      this.observers.push(observer);
      //start sequence if this is the first observer
      return {
        unsubscribe(){
          this.observers.splice(this.observers.indexOf(observer), 1);
        }
      }
    }
  }

  /**
   * connectSocket: attempts a connection to a remote websocket for audio
   * @param nodeAddress the address of the websocket to connect ip:port
   */
  connectSocket(nodeAddress: String){
    this.socket = socketIo(nodeAddress);
    this.connectionTimeout = setTimeout(() => {
      console.log("Socket connection timed out");
      this.close();
      this.connectionTimeout = null;
    }, 1000);
    this.socket.on('audio', (audioBytes: FFTSpectrum) => {
      this.audioDataFrame = new Map<number, number>(audioBytes);
      this.observers.forEach(obs => obs.next(this.audioDataFrame));
    });
    this.socket.on('device_list', (deviceList: string[]) => {
      this.deviceNames = deviceList;
    });
    this.socket.on('disconnected', () => {
      this.close();
    });
    this.socket.on('ping', () => {
      this.isConnected = true
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    });
  }

  /**
   * returns a boolean true if the socket is connected, false if otherwise
   */
  checkSocketConnected(){
    return this.isConnected;
  }

  /**
   * provides a way to access the multiplexed observer, caller can subscribe
   */
  getAudiodataStream(): Observable<Map<number, number>>{
    /**
     * getAudiodataStream: request a stream for audio bytes received from server
     * @returns an observable to subscribe to
     */
    return this.audioObserver;
  }

  /**
   * provides access to the most recent frame of without subscription
   */
  getAudioDataFrame(): Map<number, number>{
    return this.audioDataFrame;
  }

  /**
   * signals connected socket to stop the stream of audio
   */
  stopStream(){
    /**
     * stopStream: emits a stop_stream event to signal a rotini-soundnode to stop sending audio data
     */
    //stop_stream takes no argument as only 1 stream can run at a time per client
    this.socket.emit('stop_stream');

  }

  startStream(deviceName: string){
    /**
     * startStream: emits a start_stream event signaling a connected rotini-soundnode to start sending audio data
     * @param deviceName: a string representing a device (should have been received by getDeviceListInterval)
     */
    this.socket.emit('start_stream', deviceName);
  }

  close(){
    /**
     * close: shuts down socket
     * @augments this.socket -> closed socket
     */
    if(this.socket){
      this.socket.close();
    }
    this.isConnected = false;
    this.socket = null;
  }
}