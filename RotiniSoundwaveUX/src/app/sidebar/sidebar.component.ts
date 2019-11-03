import { Component, OnInit } from '@angular/core';
import {SettingsService, AppSettings} from '../settings.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  private showResolution: Boolean;
  private resolution: number;

  constructor(private settings: SettingsService) { }

  ngOnInit() {
    this.showResolution = false
  }

  oc_resolution(){
    this.showResolution = !this.showResolution;
  }

  oi_resolution(){
    this.settings.setResolution(this.resolution);
    /*this.settings.addSettingsChangeListener((aset) => {
      console.log(aset);
    })*/
    //change resolution in settings object
  }
}
