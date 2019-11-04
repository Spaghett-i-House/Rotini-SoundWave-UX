import { Component, ElementRef, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import { SocketService } from 'src/app/networkaudio/shared/services/socket.service';
import { Roundedslide } from './roundedslide';
import { SettingsService } from '../../settings.service';

/**
 * CanvasVisualizerComponent: the controller for the canvas to draw an animation on, this is
 * without using the webGL
 */
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

  constructor(audioService: SocketService, private settings: SettingsService) { 
    this.audioService = audioService;
    this.draw.bind(this);
  }

  /**
   * Built in angular function that runs after the HTML is fully rendered, starts animation loop
   * and initialized the elements need for that
   */
  ngAfterViewInit() {
    this.draw();

    /*this.canvasCenter = [this.canvasref.nativeElement.width/2, this.canvasref.nativeElement.height/2]
    this.slices = [];
    for(let i=0;i<8000; i++){
      this.slices.push(new Roundedslide(i, 8000, "#e91e36"));
    }*/
    
    /*let draw = () => {
      this.ctx.clearRect(0,0, this.canvasref.nativeElement.width, this.canvasref.nativeElement.height);
      let data = Array.from(this.audioService.getAudioDataFrame().values());
      for(let i = 0; i<this.slices.length;i++){
        this.slices[i].draw(this.canvasCenter[0], this.canvasCenter[1], this.ctx, data[i]*10);
      }
      window.requestAnimationFrame(draw);
    }
    draw();*/
  }

  private draw(){
    //console.log("Draw");
    
    let audioFFT = Array.from(this.audioService.getAudioDataFrame().values());
    this.canvas = this.canvasref.nativeElement;
    this.ctx = this.canvasref.nativeElement.getContext('2d');
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.cfelems = 400;
    let centerx = this.canvas.width/2;
    let centery = this.canvas.height/2;
    let radius = 150;
    //draw center circle:
    this.ctx.beginPath();
    this.ctx.arc(centerx,centery,radius,0,2*Math.PI);
    this.ctx.stroke();

    for(let i =0; i<this.cfelems; i++){
      //divide a circle into equal parts
      let rads = Math.PI * 2 / this.cfelems;

      let bar_height = 100*audioFFT[i+1];
      let bar_width = 2;

      let x = centerx + Math.cos(rads * i) * (radius);
      let y = centery + Math.sin(rads * i) * (radius);
      let x_end = centerx + Math.cos(rads * i)*(radius + bar_height);
      let y_end = centery + Math.sin(rads * i)*(radius + bar_height);

      //draw a bar
      //console.log(audioFFT[i]);
      let activeName = this.settings.getSettings().active_pallete;
      let params = this.settings.getSettings().palletes;
      let c1 = params[activeName].col1;
      let c2 = params[activeName].col2;
      //console.log(c1, c2);
      if(i%2 ==0){
        this.drawBar(this.ctx, x, y, x_end, y_end, bar_width, c1);
      }
      else{
        this.drawBar(this.ctx, x, y, x_end, y_end, bar_width, c2);
      }
    }
    window.requestAnimationFrame(() => {this.draw()});
  }

  private drawBar(ctx: CanvasRenderingContext2D, x1, y1, x2, y2, width, frequency){
    console.log(frequency);
    var lineColor = "rgb(" + Math.floor(frequency['r']*255) + ", " + Math.floor(frequency['g']*255) + ", " + Math.floor(frequency['b']*255) + ")";
    console.log(lineColor);
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
  }
}
