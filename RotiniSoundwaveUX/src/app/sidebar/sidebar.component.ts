import { Component, OnInit } from '@angular/core';
import {SettingsService, AppSettings} from '../settings.service';
import { SocketService } from '../networkaudio/shared/services/socket.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  private showResolution: Boolean;
  private resolution: number;
  private connectedWebsocket: boolean;
  private devices: string[];
  private streamDevice: string;

  constructor(private settings: SettingsService, private audioserv: SocketService) { }

  ngOnInit() {
    this.showResolution = false
  }

  oc_resolution(){
    this.showResolution = !this.showResolution;
  }

  oi_resolution(){
    this.settings.setResolution(this.resolution);
  }

  connectWebsocket(addr: string){
    console.log(addr);
    this.audioserv.connectSocket(addr);
  }

  startStream(deviceName){
    console.log("Stream starting"+deviceName);
    this.audioserv.startStream(deviceName);
  }

  stopStream(){
    this.audioserv.stopStream();
  }
}
