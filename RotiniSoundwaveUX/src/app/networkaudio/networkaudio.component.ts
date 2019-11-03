import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { SocketService } from './shared/services/socket.service';
import { Event, Action, AudioType, FFTSpectrum} from './shared/model/types';
import { Browseraudio } from './shared/classes/browseraudio';

@Component({
  selector: 'app-networkaudio',
  templateUrl: './networkaudio.component.html',
  styleUrls: ['./networkaudio.component.css']
})
export class NetworkaudioComponent implements OnInit {
  /**
   * NetworkAudioComponent: The page of the demo with controls to control audio and websocket
   * which carries audio
   */
  @ViewChild('canvas', { static: true }) 
  canvas: ElementRef<HTMLCanvasElement>;


  private audioSource: SocketService; //an instance of the socket that carries audio (socketIO)
  private availableDevices: string[]; //cache of names of audio devices
  audioSourceConnected: boolean = false; // a flag to tell if a source is connected for page control
  private browserAudio: Browseraudio;
  private ctx: CanvasRenderingContext2D;

  constructor() { }

  ngOnInit() {
    /**
     * ngOnInit: Runs when page initializes, set variable to start state
     */
    this.audioSource = null;
    this.availableDevices = [];
    this.browserAudio = new Browseraudio();
    this.ctx = this.canvas.nativeElement.getContext('2d');
    setInterval(() => this.draw(), 1000/60);
  }

  private draw(){
    //console.log("Draw")
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    let barvalues = this.browserAudio.getAudioFrequencyData();
    //console.log(barvalues);
    this.ctx.fillStyle = 'green';
    for(let i=0;i<barvalues.length/100; i+=1){
      this.ctx.fillRect(i, 0, 1, barvalues[i*100]*10);
    }
  }

  private connectToAudioSource(sourceurl: string): void{
    /**
     * connectToAudioSource: Reaches out and creates a connection to websocket server
     */

    console.log("[STATUS] Attempting connection to", "http://"+sourceurl);
    
    // close previous audio source to prevent conflicts
    if(this.audioSource){
      this.audioSource.close();
    }
    // create new websocket connection
    this.audioSource = new SocketService("http://"+sourceurl);
    this.audioSourceConnected = true;
    //handle socket events
    this.audioSource.onEvent(Event.DISCONNECT).subscribe(() => this.closeAudioSource());
    this.audioSource.onEvent(Event.CONNECT).subscribe(() => this.handleConnection());
    //handle potential data streams
    this.audioSource.getAudiodataStream()
      .subscribe((audioBytes: FFTSpectrum) => this.handleAudioBytes(audioBytes));
    this.audioSource.getDeviceListInterval()
      .subscribe((devices: string[]) => this.populateDeviceList(devices));


  }

  private handleAudioBytes(audioBytes: FFTSpectrum){
    /**
     * HandleAudioBytes: do something with a received audio signal
     * @requires audioBytes audioBytes must represent an array of shorts
     * @return none
     */
    //console.log(audioBytes);
    this.browserAudio.setAudioBytes(audioBytes);
    //console.log(this.browserAudio.getAudioFrequencyData());
  }

  private getFrequencyData(){
    console.log(this.browserAudio.analyser.fftSize, this.browserAudio.analyser.frequencyBinCount,
      this.browserAudio.analyser.maxDecibels);
  }

  private populateDeviceList(deviceNames: string[]){
    /**
     * populateDeviceList: take a list of device names, and set the class member variable = to it
     * @requires none
     * @augments this.availableDevices -> deviceNames
     * @return none
     */
    this.availableDevices = deviceNames;
  }

  private startAudioStream(deviceName: string){
    /**
     * startAudioStream: to be fired on an event, signals we are ready to receive audio data
     * @param deviceName: the name of an audio input device on a host computer
     * @return none
     */
    this.audioSource.startStream(deviceName);
    console.log("[STATUS] audio stream with device", deviceName, "started");
  }

  private stopAudioStream(){
    /**
     * self explanatory title opposite of startaudiostream, fired on event
     */
    this.audioSource.stopStream();
  }

  private handleConnection(){
    /**
     * handleConnection: If we wanted to do something when a websocket connection succeeds we would do it here
     */
    console.log("[STATUS]Successfully connected to websocket");
  }

  private closeAudioSource(){
    /**
     * closeAudioSource: closes the websocket connection to the sound node, sets all associated variables
     * @augments this.audioSource -> null
     * @augments this.audioSourceConnected -> false
     */
    console.log("[STATUS] Audio source closed");
    this.audioSource.close();
    this.audioSource = null;
    this.audioSourceConnected = false;
    //this.availableDevices = [];
  }

  private convertShortArrayToFloat(shortArray: Int16Array): Float32Array{
    /**
     * convertShortArrayToFloat: converts an Int16Array to a Float32Array between -1 and 1
     * @param shortArray: an Int16Array to be converted to a float32 array
     * @returns a float32 array, where the values are converted from shortArray
     */
    const audioAsFloat = new Float32Array(shortArray.length); // allocate a float32 array
    for(let i=0;i<shortArray.length;i++){ 
      audioAsFloat[i] = shortArray[i]/32767; //convert int16 to 1, maxvalue of int16 is 32767
    }
    return audioAsFloat;
  }
}
