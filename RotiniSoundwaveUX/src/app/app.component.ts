import { Component } from '@angular/core';
import { SettingsService } from './settings.service';

/**
 * AppComponent: the base class for the application
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'RotiniSoundwaveUX';
  private navOpen: Boolean;

  /**
   * constructor
   * @param settings: the injectable settings service 
   */
  constructor(private settings: SettingsService){}

  /**
   * ngOnInit: runs on initialization of the browser page
   */
  ngOnInit(){
    this.navOpen = false;
  }

  /**
   * onSidebarToggle: an event listener made to be run on button click to open side bar
   * @param event: the click event
   */
  onSidebarToggle(event){
    this.navOpen = !this.navOpen;
  }
}
