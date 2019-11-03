import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualizerComponent } from './visualizer/visualizer.component';



@NgModule({
  declarations: [VisualizerComponent],
  imports: [
    CommonModule
  ],
  exports: [
    VisualizerComponent
  ]
})
export class WebglvisualizerModule { }
