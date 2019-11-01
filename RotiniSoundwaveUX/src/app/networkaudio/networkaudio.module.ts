import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NetworkaudioComponent } from './networkaudio.component';
import { VisualizercanvasComponent } from './shared/components/visualizercanvas/visualizercanvas.component';



@NgModule({
  declarations: [NetworkaudioComponent, VisualizercanvasComponent],
  imports: [
    CommonModule
  ],
  exports: [
    NetworkaudioComponent
  ]
})
export class NetworkaudioModule { }
