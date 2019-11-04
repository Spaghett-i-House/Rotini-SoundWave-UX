import { Component, OnInit, AfterViewInit, NgZone, ElementRef, ViewChild} from '@angular/core';
import { SettingsService, AppSettings } from '../../settings.service';
import { SocketService } from '../../networkaudio/shared/services/socket.service';
import { FFTSpectrum } from 'src/app/networkaudio/shared/model/types';
var gl_mat = require('../../../assets/gl-matrix');
//import { mat4 } from '../../../assets/gl-matrix';

const vsSource = `
attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying lowp vec4 vColor;

void main() {
	gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
	vColor = aVertexColor;
}`;

const fsSource = `
varying lowp vec4 vColor;
void main() {
	gl_FragColor = vColor;
}`;

@Component({
  selector: 'app-visualizer',
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.css']
})
export class VisualizerComponent implements AfterViewInit {
  @ViewChild('canvas', {static: true})
  canvas: ElementRef<HTMLCanvasElement>;

  private ctx: WebGLRenderingContext;
  private shaderProgram: any;
  private programInfo: any;
  private buffers: any;
  private positions: number[];
  private vertexCount = 0;
  private cScale = 1;
  private soundQueue: FFTSpectrum[];

  constructor(private settings: SettingsService, private audioService: SocketService) {
    this.soundQueue = [];
  }

  ngAfterViewInit() {

    this.ctx = this.canvas.nativeElement.getContext('webgl');
    this.changeRes(.75);
    this.settings.addSettingsChangeListener((settings: AppSettings) => {
      this.changeRes(settings.resolution);
    });

    this.shaderProgram = this.initShaderProgram();
    this.programInfo = {
      program: this.shaderProgram,
        attribLocations: {
        vertexPosition: this.ctx.getAttribLocation(this.shaderProgram, 'aVertexPosition'),
            vertexColor: this.ctx.getAttribLocation(this.shaderProgram, 'aVertexColor'),
        },
      uniformLocations: {
        projectionMatrix: this.ctx.getUniformLocation(this.shaderProgram, 'uProjectionMatrix'),
        modelViewMatrix: this.ctx.getUniformLocation(this.shaderProgram, 'uModelViewMatrix'),
        },
    };
    const cFidelity = 40;
    this.positions = [0.0, 0.0];

    let render = (now) => {
      now *= 0.001; //to seconds
      let fftArray = this.audioService.getCurrentFFT();
      this.initialPositionArray(cFidelity);
      let buffer = this.initBuffers(fftArray, cFidelity);

      this.drawScene(this.ctx, this.programInfo, buffer, now);

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }

  private initialPositionArray(cFidelity){
    /*const positions = [
      0.0, 0.0 // vertex always
    ];*/
    

    for (let i = 0; i <= cFidelity * 2; i++) {
      if( i % 2 == 0) {
        this.positions.push(Math.cos(i * Math.PI/cFidelity)/10); // x coord
        this.positions.push(Math.sin(i * Math.PI/cFidelity)/10); // y coord
      }
      else {
        this.positions.push(Math.cos((i-1) * Math.PI/cFidelity)/10); // x coord
        this.positions.push(Math.sin((i-1) * Math.PI/cFidelity)/10); // y coord			
      }
    }
  }

  private initBuffers(fftData, cFidelity){
    // Create a buffer for the positions.
    const positionBuffer = this.ctx.createBuffer();
    // Select the positionBuffer as the one to apply buffer
    // operations to from here out.
    this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, positionBuffer);
    // console.log(fftData.splice(0,40));
    // Now create an array of positions for the outer verts.
    let shift = 1;
    for(let i=0; i<this.positions.length; i++){
      if(i%4 == 0){
        if(i+1<fftData.length){
          shift=1 + ((fftData[i+1] - 4) / 10);
        }
      }
      this.positions[i]*=shift
      /*if(i >= fftData.length){
        this.positions[i] *= 1;
      }
      else{
        this.positions[i] *= fftData[i];
      }*/
    }
    //console.log(positions);
    this.vertexCount = this.positions.length/2;

    // F32 array -> WebGL to build shape
    this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Float32Array(this.positions), this.ctx.STATIC_DRAW);

    let col = this.rgbaNorm("#ffd1dc");

    // Array of colors to do
    const colors = [
      col.r, col.g, col.b, col.a // START WITH ONE
    ];
    for (let i = 0; i <= this.positions.length; i++) {
      colors.push(col.r, col.g, col.b, col.a);
    }

    const colorBuffer = this.ctx.createBuffer();
    this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, colorBuffer);
    this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Float32Array(colors), this.ctx.STATIC_DRAW);

    return {
      position: positionBuffer,
      color: colorBuffer,
    };
  }

  private drawScene(gl, programInfo, buffers, now){
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

    // Clear the canvas before we start drawing on it.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Create a perspective matrix
    // FOV: 45d, W/H: canvas, sight: 0.1 - 100 from camera
    const fieldOfView = this.radian(45);   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = gl_mat.mat4.create();

    // note: glmatrix.js always has the first argument
    // as the destination to receive the result.
    gl_mat.mat4.perspective(projectionMatrix,
            fieldOfView,
            aspect,
            zNear,
            zFar);

    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix = gl_mat.mat4.create();

    // Now move the drawing position a bit to where we want to
    // start drawing.

    gl_mat.mat4.translate(modelViewMatrix,     // destination matrix
            modelViewMatrix,     		// matrix to translate
            [-0.0, 0.0, -6.0]);  		// amount to translate

    // And then scale the matrix by said amount
    gl_mat.mat4.scale(modelViewMatrix,  		// destination matrix
            modelViewMatrix,     		// matrix to scale
              [this.cScale, this.cScale, this.cScale]);   // amount to scale

    // position buffer -> vertexAttribute pointer
    {
      const numComponents = 2;  // pull out 2 values per iteration
      const type = gl.FLOAT;    // the data in the buffer is 32bit floats
      const normalize = false;  // don't normalize
      const stride = 0;         // how many bytes to get from one set of values to the next
                                // 0 = use type and numComponents above
      const offset = 0;         // how many bytes inside the buffer to start from
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
      gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
      gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    }

    // color buffer -> vertexAttribute pointer
    {
      const numComponents = 4;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
      gl.vertexAttribPointer(
        programInfo.attribLocations.vertexColor,
        numComponents,
        type,
        normalize,
        stride,
        offset);
      gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
    }

    // Tell WebGL to use our program when drawing
    gl.useProgram(programInfo.program);

    // Set the shader uniforms
    gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix);
    gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix);
    {
      const offset = 0;
      gl.drawArrays(gl.TRIANGLE_FAN, offset, this.vertexCount);
    }

    /*// Pulse big and small
    const scaleF = 0.02;
    const speedF = 10;

    // console.log(Math.pow(Math.sin(speedF * now), 3));
    this.cScale += scaleF * Math.pow(Math.sin(speedF * now), 3);*/
  }

  private initShaderProgram(){
    const vertexShader = this.loadShader(this.ctx.VERTEX_SHADER, vsSource);
    const fragmentShader = this.loadShader(this.ctx.FRAGMENT_SHADER, fsSource);

    const shaderProgram = this.ctx.createProgram();
    this.ctx.attachShader(shaderProgram, vertexShader);
    this.ctx.attachShader(shaderProgram, fragmentShader);
    this.ctx.linkProgram(shaderProgram);
    //check program failure
    if(!this.ctx.getProgramParameter(shaderProgram, this.ctx.LINK_STATUS)) {
      console.log("[ERROR] Unable to utilize the shader program " + this.ctx.getProgramInfoLog(shaderProgram));
      return null;
    }

    return shaderProgram;
  }

  private loadShader(type, source){
    const shader = this.ctx.createShader(type);
    this.ctx.shaderSource(shader, source);
    this.ctx.compileShader(shader);

    //check that compilation was successfull

    if(!this.ctx.getShaderParameter(shader, this.ctx.COMPILE_STATUS)){
      alert('An error occurred compiling the shaders: ' + this.ctx.getShaderInfoLog(shader));
      this.ctx.deleteShader(shader);
      return null;
    }

    return shader;
  }

  private changeRes(perc: number){
    const w = 1920*perc;
    const h = 1080*perc;

    this.canvas.nativeElement.width = w;
    this.canvas.nativeElement.height = h;
    this.ctx.viewport(0, 0, w, h);

  }

  private rgbaNorm(hex, opac?: any) {
    if (hex[0] == '#')
		hex = hex.slice(1);

    const rv = parseInt(hex.substring(0,2), 16) / 255.0;
    const gv = parseInt(hex.substring(2,4), 16) / 255.0;
    const bv = parseInt(hex.substring(4,6), 16) / 255.0;

    if (opac === null || typeof opac === "undefined")
    	opac = 1.0;
    else
    	opac /= 255.0;

    return {r: rv, g: gv, b: bv, a: opac}
  }

  private radian(degree: number){
    let rad = degree*(Math.PI/1080);
    return rad;
  }

}
