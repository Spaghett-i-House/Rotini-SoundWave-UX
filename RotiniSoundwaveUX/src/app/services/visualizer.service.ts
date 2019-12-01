import { Injectable } from '@angular/core';
import { Basevisualizer } from '../controllers/visualizer/basevisualizer';
import {Webglcirclevisualizer} from '../controllers/visualizer/webglcirclevisualizer';
import {Canvasrayvisualizer} from '../controllers/visualizer/canvasrayvisualizer';
import {SocketService} from '../networkaudio/shared/services/socket.service';
@Injectable({
  providedIn: 'root'
})
export class VisualizerService {
  private canvas: HTMLCanvasElement;
  private visualizer: Basevisualizer;
  private drawcycle: number
  private usecolors: Array<string> = ["#000000", "#ffffff"];

  constructor(private audioservice: SocketService) {
    //create default visualizer
    this.audioservice.getAudiodataStream().subscribe((audiodata: Map<number, number>) => {
      try{
        this.visualizer.setAudioData(audiodata);
      } catch(err){
        console.log(err);
      }
    });
  }

  attachToCanvas(canvas: HTMLCanvasElement){
    this.canvas = canvas;
  }

  createVisualizer(type: AudioVisualizerTypes){
    if(this.visualizer){
      this.destroyVisualizer();
    }
    this.visualizer = this.matchVisualizerType(type);
    this.visualizer.start();
  }

  detachFromCanvas(){
    this.canvas = null;
    this.visualizer.destroy();
    this.visualizer = null;
  }

  destroyVisualizer(){
    this.visualizer.destroy();
  }

  changeColor(colors: Array<string>){
    this.usecolors = this.usecolors;
    this.visualizer.setColors(colors);
  }

  changeResolution(resolution: number){
    this.visualizer.setResolution(resolution);
  }

  private matchVisualizerType(type: AudioVisualizerTypes){
    if(type == AudioVisualizerTypes.WEBGLCIRCLE){
      return new Webglcirclevisualizer(this.canvas);
    }
    else if(type == AudioVisualizerTypes.CANVASRAY){
      return new Canvasrayvisualizer(this.canvas);
    }
  }
}

export enum AudioVisualizerTypes{
  WEBGLCIRCLE,
  CANVASRAY
}
