import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private appSettings: AppSettings;
  private activeObservables: ((AppSettings) => void)[];

  constructor() { 
    this.appSettings = new AppSettings();
    this.activeObservables = [];
  }

  addSettingsChangeListener(callback: (AppSettings) => void){
    this.activeObservables.push(callback);
  }

  setResolution(newResolution: number){
    this.appSettings.resolution = newResolution;
    for(let i=0;i<this.activeObservables.length; i++){
      const callback = this.activeObservables[i];
      try{
        callback(this.appSettings);
      } catch (err){
        this.activeObservables.splice(i);
        console.log("[DEBUG] Removed settings listener");
      }
    }
  }
}

export class AppSettings{
  resolution: number = .75;
}