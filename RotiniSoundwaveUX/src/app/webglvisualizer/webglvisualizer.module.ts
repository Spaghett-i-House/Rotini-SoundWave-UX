import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualizerComponent } from './visualizer/visualizer.component';
import { CanvasvisualizerComponent } from './canvasvisualizer/canvasvisualizer.component';



@NgModule({
  declarations: [VisualizerComponent, CanvasvisualizerComponent],
  imports: [
    CommonModule
  ],
  exports: [
    VisualizerComponent, CanvasvisualizerComponent
  ]
})
export class WebglvisualizerModule { }
