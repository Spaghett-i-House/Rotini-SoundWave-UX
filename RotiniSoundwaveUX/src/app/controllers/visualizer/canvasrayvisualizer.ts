import {Basevisualizer} from './basevisualizer';
import { rgbaNorm } from '../../common/utils';
import { Roundedslide } from './roundedslide';
export class Canvasrayvisualizer extends Basevisualizer{
    private ctx: CanvasRenderingContext2D;
    private canvasCenter: [number, number]; //x, y
    private cfelems: number;
    private slices: Roundedslide[];
  
    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
        this.canvas = canvas;
        //this.draw.bind(this);
        this.ctx = this.canvas.getContext('2d');
    }

    protected visualize(){
        //console.log("Draw");
            
        let audioFFT = Array.from(this.audioData.values());
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
        let curcolor = this.colors[i%this.colors.length];
        this.drawBar(this.ctx, x, y, x_end, y_end, bar_width, curcolor);
        }
    }
  
    private drawBar(ctx: CanvasRenderingContext2D, x1, y1, x2, y2, width, hexval){
      //var lineColor = "rgb(" + Math.floor(rgbval['r']*255) + ", " + Math.floor(rgbval['g']*255) + ", " + Math.floor(rgbval['b']*255) + ")";
      ctx.strokeStyle = hexval;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(x1,y1);
      ctx.lineTo(x2,y2);
      ctx.stroke();
    }
}
