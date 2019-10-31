import { Component, OnInit } from '@angular/core';
import { SocketService } from './shared/services/socket.service';
import { Event, Action } from './shared/model/event';

@Component({
  selector: 'app-networkaudio',
  templateUrl: './networkaudio.component.html',
  styleUrls: ['./networkaudio.component.css']
})
export class NetworkaudioComponent implements OnInit {
  private audioSource: SocketService;
  private availableDevices: string[];
  private context: AudioContext;
  audioSourceConnected: boolean = false;
  constructor() { }

  ngOnInit() {
    this.audioSource = null;
    this.availableDevices = [];
    this.context = new AudioContext();
  }

  private connectToAudioSource(sourceurl: string): void{
    console.log("Attempting connection to", "http://"+sourceurl);
    // close previous audio source
    if(this.audioSource){
      this.audioSource.close();
    }
    // create new audio source
    this.audioSource = new SocketService("http://"+sourceurl);
    this.audioSourceConnected = true;
    //handle receiving audio data
    this.audioSource.onAudioData().subscribe((audioBytes: ArrayBuffer) => this.handleAudioBytes(audioBytes));
    //handle receiving a list of devices
    this.audioSource.onDevices().subscribe((devices: string[]) => {
      //console.log("received devices");
      this.populateDeviceList(devices);
    })
    // Handle audio socket disconnecting
    this.audioSource.onEvent(Event.DISCONNECT).subscribe(() => {
      console.log("Disconnected");
      this.closeAudioSource();
    });
    // Handle audio socket connected
    this.audioSource.onEvent(Event.CONNECT).subscribe(() => {
      console.log("Connected");
    });
  }

  private handleAudioBytes(audioBytes: ArrayBuffer){
    const audio = new Int16Array(audioBytes);
    //console.log(audio);
    const audioAsFloat = new Float32Array(audio.length);
    for(let i=0;i<audio.length;i++){
      audioAsFloat[i] = audio[i]/32767;
    }
    console.log(audioAsFloat);
    //console.log(audioAsFloat.length);
    var myArrayBuffer = this.context.createBuffer(1, audio.length, 44100);
    myArrayBuffer.copyToChannel(audioAsFloat, 0, 0);
    /*let nowbuf = myArrayBuffer.getChannelData(0);
    nowbuf = audioAsFloat;*/


    let source = this.context.createBufferSource();
    source.buffer = myArrayBuffer;
    source.connect(this.context.destination);
    source.start();
  }

  private populateDeviceList(deviceNames: string[]){
    this.availableDevices = deviceNames;
  }

  private startAudioStream(deviceName: string){
    this.audioSource.startStream(deviceName);
    console.log("Stream finished");
  }

  private stopAudioStream(){
    this.audioSource.stopStream();
  }

  private closeAudioSource(){
    console.log("[STATUS] Audio source closed");
    this.audioSource.close();
    this.audioSource = null;
    this.audioSourceConnected = false;
    //this.availableDevices = [];
  }
}
