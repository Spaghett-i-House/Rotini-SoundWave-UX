import { Component, OnInit } from '@angular/core';
import {SettingsService, AppSettings} from '../settings.service';
import { SocketService } from '../networkaudio/shared/services/socket.service';


/**
 * SidebarComponent: the controller for the settings sidebar on right side of screen
 */
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  private show = {
    "sources": false,
    "newPalletes": false,
    "palletes": false,
    "resolution": false,
    "frequencies": false
  }
  private selectedPallete: string;
  private palletes: string[];
  private resolution: number;
  private connectedWebsocket: boolean;
  private devices: string[];
  private streamDevice: string;
  private palletes_names: string[];
  public freq1: number;
  public freq2: number;

  constructor(private settings: SettingsService, private audioserv: SocketService) {
    this.freq1 = 20;
    this.freq2 = 2200;  
  }

  ngOnInit() { }

  /**
   * toggles a subsection to show
   * @param name the name of the subsection to show
   */
  oc_toggle(name){
    this.updatePalleteList();
    this.show[name] = !this.show[name];
  }

  /**
   * updateFreqs: updates the upper and lower frequency bounds
   */
  updateFreqs(f1, f2) {
    let valid = true;
    let f1v = parseFloat(f1.value);
    let f2v = parseFloat(f2.value);

    if (isNaN(f1v) || f1v < 20 || f1v > 22000 || (!isNaN(f2v) && f1v > f2v)) {
      f1.value = ""
      valid = false;
    } 
    if (isNaN(f2v) || f2v < 20 || f2v > 22000 || (!isNaN(f1v) && f1v > f2v)) {
      f2.value = ""
      valid = false;
    }

    if (valid) {
      this.freq1 = f1v;
      this.freq2 = f2v;
      this.audioserv.setFilter(this.freq1, this.freq2);
    }
  }

  /**
   * updatePalleteList: updates the list of palletes in settings
   */
  updatePalleteList(){
    let palletes_names = this.settings.getSettings().palletes;
    this.palletes_names = [];
    console.log(palletes_names);
    for(let name in palletes_names){
      console.log(name);
      this.palletes_names.push(name);
    }
  }

  /**
   * oc_palletes: changes the current active pallete in settings
   */
  oc_palletes(){
    this.settings.getSettings().active_pallete = this.selectedPallete;
    this.settings.pushSettings();
  }

  /**
   * Creates a new pallete in settings
   * @param tname the name of the new pallete
   * @param thex1 the hex value of the first color of pallete
   * @param thex2 the hex value of the second color of the pallete
   */
  oc_newpalletecontainer(tname, thex1, thex2){
    this.settings.addPallete(tname, thex1, thex2);
    this.settings.pushSettings();
  }

  /**
   * Triggered on the resolution slider changing, changes the resolution of render
   */
  oi_resolution(){
    this.settings.setResolution(this.resolution);
  }

  /**
   * connectWebsocket: triggered on a request to connect, attempts connection to websocket
   * @param addr the address of the websocket ip:port
   */
  connectWebsocket(addr: string){
    console.log(addr);
    this.audioserv.connectSocket(addr);
  }

  /**
   * startStream: triggers the start of audio data transfer from a connected socket
   * @param deviceName the audio device to get audio data from 
   */
  startStream(deviceName){
    console.log("Stream starting"+deviceName);
    this.audioserv.startStream(deviceName);
  }

  /**
   * stopStream: triggers the end of audio data sending
   */
  stopStream(){
    this.audioserv.stopStream();
  }
}
