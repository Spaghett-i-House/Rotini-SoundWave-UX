import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-visualizercanvas',
  templateUrl: './visualizercanvas.component.html',
  styleUrls: ['./visualizercanvas.component.css']
})
export class VisualizercanvasComponent implements OnInit {
  @ViewChild('canvas', {static: true})
  canvas: ElementRef<HTMLCanvasElement>;
  private i: number = 0;

  private ctx: CanvasRenderingContext2D;

  constructor() { }

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    //setInterval(() => this.animate(), 1000);
  }

  animate(): void{
    this.ctx.fillStyle = 'red';
    const square = new Square(this.ctx);
    square.draw(5, 1+this.i, 20);
    this.i +=1;
  }

  private displayBuffer(buffer: AudioBuffer){
    var drawLines = 500;
    var leftChannel = buffer.getChannelData(0); // Float32Array describing left channel     
    var lineOpacity = this.canvas.nativeElement.width / leftChannel.length  ;      
    this.ctx.save();
    this.ctx.fillStyle = '#080808' ;
    this.ctx.fillRect(0,0,canvasWidth,canvasHeight );
    this.ctx.strokeStyle = '#46a0ba';
    this.ctx.globalCompositeOperation = 'lighter';
    this.ctx.translate(0,canvasHeight / 2);
    //this.ctx.globalAlpha = 0.6 ; // lineOpacity ;
    this.ctx.lineWidth=1;
    var totallength = leftChannel.length;
    var eachBlock = Math.floor(totallength / drawLines);
    var lineGap = (canvasWidth/drawLines);

    this.ctx.beginPath();
    for(var i=0;i<=drawLines;i++){
        var audioBuffKey = Math.floor(eachBlock * i);
        var x = i*lineGap;
        var y = leftChannel[audioBuffKey] * canvasHeight / 2;
        this.ctx.moveTo( x, y );
        this.ctx.lineTo( x, (y*-1) );
    }
    this.ctx.stroke();
    this.ctx.restore();
  }
}


export class Square {
  constructor(private ctx: CanvasRenderingContext2D) {}

  draw(x: number, y: number, z: number) {
    this.ctx.fillRect(z * x, z * y, z, z);
  }
}
