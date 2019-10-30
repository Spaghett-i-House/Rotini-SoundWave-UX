import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorPickerComponent } from './color-picker.component';
import { ColorSliderComponent } from './color-slider/color-slider.component';
import { ColorPaletteComponent } from './color-palette/color-palette.component';



@NgModule({
  imports: [CommonModule],
  declarations: [ColorPickerComponent, ColorSliderComponent, ColorPaletteComponent],
  exports: [ColorPickerComponent],
})
export class ColorPickerModule { }
