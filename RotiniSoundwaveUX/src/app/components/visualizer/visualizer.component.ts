import { Component, OnInit, AfterViewInit, NgZone, ElementRef, ViewChild} from '@angular/core';
import {VisualizerService, AudioVisualizerTypes} from '../../services/visualizer.service';

@Component({
  selector: 'app-visualizer',
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.css']
})
export class VisualizerComponent implements OnInit {
  @ViewChild('canvas', {static: true})
  canvas: ElementRef<HTMLCanvasElement>;

  constructor(private visualizerService: VisualizerService) { }

  ngOnInit() {
    this.visualizerService.attachToCanvas(this.canvas.nativeElement);
    //create default visualizer
    this.visualizerService.createVisualizer(AudioVisualizerTypes.WEBGLCIRCLE);
  }

}
