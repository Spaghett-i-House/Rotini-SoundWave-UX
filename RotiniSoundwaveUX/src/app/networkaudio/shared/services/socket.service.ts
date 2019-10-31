import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Event, Action } from '../model/event';
import * as socketIo from 'socket.io-client';
import * as ss from 'socket.io-stream';
@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket;

  constructor(nodeAddress: string) {
    this.socket = socketIo(nodeAddress);
    this.socket.on("message", (message) => {console.log(message);})
  }

  public onAudioData(): Observable<ArrayBuffer>{ //This needs to be typed to how audio is sent
    return new Observable<ArrayBuffer>(observer => {
      this.socket.on('audio', (audioBytes: ArrayBuffer) => observer.next(audioBytes));
    });
  }

  public onDevices(): Observable<string[]>{
    return new Observable<string[]>(observer => {
      this.socket.on('device_list', (deviceList: string[]) => {
        //console.log("Observer received device message");
        observer.next(deviceList);
      });
    });
  }

  public onEvent(event: Event): Observable<any>{
    return new Observable<Event>(observer => {
      this.socket.on(event, () => observer.next());
    })
  }

  public stopStream(){
    this.socket.emit('stop_stream');

  }

  public startStream(deviceName: string){
    this.socket.emit('start_stream', deviceName);
  }

  public close(){
    this.socket.close();
  }
}