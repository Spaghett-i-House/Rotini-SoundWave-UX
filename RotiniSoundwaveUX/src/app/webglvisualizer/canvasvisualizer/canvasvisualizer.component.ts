import { Component, ElementRef, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import { SocketService } from 'src/app/networkaudio/shared/services/socket.service';
import { Roundedslide } from './roundedslide';

@Component({
  selector: 'app-canvasvisualizer',
  templateUrl: './canvasvisualizer.component.html',
  styleUrls: ['./canvasvisualizer.component.css']
})
export class CanvasvisualizerComponent implements AfterViewInit  {
  @ViewChild('canvas', {static: true})
  canvasref: ElementRef<HTMLCanvasElement>;
  
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private canvasCenter: [number, number]; //x, y
  private cfelems: number;
  private slices: Roundedslide[];
  private audioService: SocketService;

  constructor(audioService: SocketService) { 
    this.audioService = audioService;
  }

  ngAfterViewInit() {
    this.canvas = this.canvasref.nativeElement;
    this.ctx = this.canvasref.nativeElement.getContext('2d');
    this.cfelems = 10;
    this.canvasCenter = [this.canvasref.nativeElement.width/2, this.canvasref.nativeElement.height/2]
    this.slices = [];
    for(let i=0;i<8000; i++){
      this.slices.push(new Roundedslide(i, 8000, "#e91e36"));
    }
    
    let draw = () => {
      this.ctx.clearRect(0,0, this.canvasref.nativeElement.width, this.canvasref.nativeElement.height);
      let data = Array.from(this.audioService.getAudioDataFrame().values());
      for(let i = 0; i<this.slices.length;i++){
        this.slices[i].draw(this.canvasCenter[0], this.canvasCenter[1], this.ctx, data[i]*10);
      }
      window.requestAnimationFrame(draw);
    }
    draw();
  }
}
