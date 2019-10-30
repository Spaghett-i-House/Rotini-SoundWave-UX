import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Output,
  HostListener,
  EventEmitter,
} from '@angular/core'

@Component({
  selector: 'app-color-slider',
  templateUrl: './color-slider.component.html',
  styleUrls: ['./color-slider.component.css'],
})

export class ColorSliderComponent implements AfterViewInit {

  //reference to the HTML canvas element - allows us to use canvas with Angular
  @ViewChild('canvas', {static: false})
  canvas: ElementRef<HTMLCanvasElement>

  @Output()
  color: EventEmitter<string> = new EventEmitter()

  //store context object as a private variable
  private ctx: CanvasRenderingContext2D
  private mousedown: boolean = false        //saves mousedown state
  private selectedHeight: number

  ngAfterViewInit() {
    this.draw()
  }

  draw() {
    if (!this.ctx) {
      this.ctx = this.canvas.nativeElement.getContext('2d')
    }

    //get width and height of canvas element
    const width = this.canvas.nativeElement.width
    const height = this.canvas.nativeElement.height

    //clear the canvas
    this.ctx.clearRect(0, 0, width, height)


    //create a gradient and divide into 6 sub-gradients
    const gradient = this.ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, 'rgba(255, 0, 0, 1)')
    gradient.addColorStop(0.17, 'rgba(255, 255, 0, 1)')
    gradient.addColorStop(0.34, 'rgba(0, 255, 0, 1)')
    gradient.addColorStop(0.51, 'rgba(0, 255, 255, 1)')
    gradient.addColorStop(0.68, 'rgba(0, 0, 255, 1)')
    gradient.addColorStop(0.85, 'rgba(255, 0, 255, 1)')
    gradient.addColorStop(1, 'rgba(255, 0, 0, 1)')

    //fill the canvas with the gradient
    this.ctx.beginPath()
    this.ctx.rect(0, 0, width, height)
    this.ctx.fillStyle = gradient
    this.ctx.fill()
    this.ctx.closePath()

    //drawing the slider nob
    if (this.selectedHeight) {
      this.ctx.beginPath()
      this.ctx.strokeStyle = 'white'
      this.ctx.lineWidth = 5
      this.ctx.rect(0, this.selectedHeight - 5, width, 10)
      this.ctx.stroke()
      this.ctx.closePath()
    }
  }

  //event callback to listen for when mouse is no longer pressed down
  @HostListener('window:mouseup', ['$event'])
  onMouseUp(evt: MouseEvent) {
    this.mousedown = false
  }

  //when the mouse is down, save that state
  onMouseDown(evt: MouseEvent) {
    this.mousedown = true
    this.selectedHeight = evt.offsetY
    this.draw()
    this.emitColor(evt.offsetX, evt.offsetY)
  }

  //when mouse moves, check if mousedown is true...if so, update with new color
  onMouseMove(evt: MouseEvent) {
    if (this.mousedown) {
      this.selectedHeight = evt.offsetY
      this.draw()
      this.emitColor(evt.offsetX, evt.offsetY)
    }
  }

  //read and emit the color at the selected position
  emitColor(x: number, y: number) {
    const rgbaColor = this.getColorAtPosition(x, y)
    this.color.emit(rgbaColor)
  }


  //reads out the color at the given position
  getColorAtPosition(x: number, y: number) {
    const imageData = this.ctx.getImageData(x, y, 1, 1).data
    return (
      'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)'
    )
  }
}
