import { Component } from '@angular/core';
import { SettingsService } from './settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'RotiniSoundwaveUX';
  private navOpen: Boolean;

  constructor(private settings: SettingsService){}

  ngOnInit(){
    this.navOpen = false;
  }

  onSidebarToggle(event){
    this.navOpen = !this.navOpen;
  }
}
