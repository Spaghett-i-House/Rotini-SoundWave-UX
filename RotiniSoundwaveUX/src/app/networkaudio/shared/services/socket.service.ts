/**
 * Author: Gabriel Vande Hei
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Event, Action , FFTBlock, FFTSpectrum} from '../model/types';
import * as socketIo from 'socket.io-client';
import { Browseraudio } from '../classes/browseraudio';


@Injectable({
  providedIn: 'root'
})
export class SocketService {
  /**
   * SocketService: provides communication with a rotini-soundnode sound websocket
   */

  private socket: socketIo; //the websocket connection
  private audioQueue: Browseraudio;

  constructor(){
    this.connectSocket = this.connectSocket.bind(this);
    this.audioQueue = new Browseraudio();
  }
  //constructor(nodeAddress: string) {
    /**
     * @param nodeAddress: the address where the rotini-sourndnode websocket should be located
     */
    // connect socket
    //this.socket = socketIo(nodeAddress);
  //}

  connectSocket(nodeAddress: String){
    this.socket = socketIo(nodeAddress);
    this.socket.on('audio', (audioBytes: FFTSpectrum) => {
      //console.log(audioBytes);
      this.audioQueue.setAudioBytes(audioBytes);
    });
  }

  checkSocketConnected(){
    if(this.socket){
      return true;
    }
    else{
      return false;
    }
  }

  getAudiodataStream(): Observable<FFTSpectrum>{
    /**
     * getAudiodataStream: request a stream for audio bytes received from server
     * @returns an observable to subscribe to
     */
    return new Observable<FFTSpectrum>(observer => {
      // audio is tranported as an event with an arraybuffer of audio bytes (short for now)
      this.socket.on('audio', (audioBytes: FFTSpectrum) => {
        this.audioQueue.setAudioBytes(audioBytes);
        observer.next(audioBytes);
      })
    });
  }

  getDeviceListInterval(): Observable<string[]>{
    /**
     * getDeviceListInterval: requests a stream for receiving the periodic transmission of available
     * audio devices from a connected rotini-soundnode
     * @returns an observable to subscribe to containing lists of device names
     */
    return new Observable<string[]>(observer => {
      // device_list is emitted periodically, its argument is an array of device names
      this.socket.on('device_list', (deviceList: string[]) => {
        observer.next(deviceList);
      });
    });
  }

  onEvent(event: Event): Observable<any>{
    /**
     * onEvent: gets a stream of events like connection and disconnection
     * @return an observable to any events that arise in the socket
     */
    return new Observable<Event>(observer => {
      this.socket.on(event, () => observer.next());
    })
  }

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

  getCurrentFFT(){
    return this.audioQueue.getAudioFrequencyData();
  }

  close(){
    /**
     * close: shuts down socket
     * @augments this.socket -> closed socket
     */
    if(this.socket){
      this.socket.close();
    }
  }
}