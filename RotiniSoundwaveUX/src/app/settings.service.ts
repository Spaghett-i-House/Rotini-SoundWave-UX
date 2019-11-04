import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as utils from './webglvisualizer/visualizer/utils'

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  /**
   * Provides a way for a single instance of angular app to react to settings changes 
   */
  private appSettings: AppSettings;
  private activeObservables: ((AppSettings) => void)[];
  private activeConnectionL: (() => void)[];

  constructor() { 
    this.appSettings = new AppSettings();
    this.activeObservables = [];
    this.activeConnectionL = [];
  }

  addSettingsChangeListener(callback: (AppSettings) => void){
    /**
     * addSettingsChangeListener: If a setting is changed, this needs to be signalled
     *                            to all who rely on the setting, this function subscribes
     *                            to that signal
     *@param callback: callable(AppSettings) => the function to be run on settings change
     */
    this.activeObservables.push(callback);
  }

  setResolution(newResolution: number){
    /**
     * setResolution: sets the resolution of visualization and propogates changes to all listeners
     */
    this.appSettings.resolution = newResolution;
    this.pushSettings();
  }

  connectionMade(){
    /**
     * connectionMade: signals to all listeners for a connection, that the connection has been made
     */
    for(let i=0;i<this.activeConnectionL.length; i++){
      const callback = this.activeConnectionL[i];
      try{
        callback();
      } catch (err){
        this.activeObservables.splice(i);
        console.log("[DEBUG] Removed settings listener");
      }
    }
  }

  listenForConnection(callback: () => void){
    /**
     * listenForConnection: adds a callback to be run when a socket connection signal is sent
     */
    this.activeConnectionL.push(callback);
  }

  addPallete(name, hex1, hex2){
    /**
     * addPallete: Adds a specified pallete to the pallete array to be used in visualizaton
     * @param name: the name for the pallete to be stored under
     */
    this.appSettings.palletes[name] = {
      col1: utils.rgbaNorm(hex1),
      col2: utils.rgbaNorm(hex2)
    }
    this.pushSettings();
  }

  getSettings(){
    /**
     * gets the current settings
     * @return the available settings AppSetting instance
     */
    return this.appSettings;
  }

  pushSettings(){
    /**
     * Propagates setting changes through all listeners
     */
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
  /**
   * A class to define available settings and defaults
   */
  resolution: number = .75;
  palletes: {} = {
    "candy": {
      col1: utils.rgbaNorm("#ffd1dc"),
      col2: utils.rgbaNorm("#ffd9e2")
    },
    "halloween": {
      col1: utils.rgbaNorm("#ff7a1c"),
      col2: utils.rgbaNorm("#2b2b2b")
    }
  };
  active_pallete: string = "candy";
}