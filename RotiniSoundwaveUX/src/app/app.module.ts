import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NetworkaudioModule } from './networkaudio/networkaudio.module';
import { WebglvisualizerModule } from './webglvisualizer/webglvisualizer.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { GearComponent } from './gear/gear.component';
import { VisualizerComponent } from './components/visualizer/visualizer.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    GearComponent,
    VisualizerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NetworkaudioModule,
    WebglvisualizerModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
