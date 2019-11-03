import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NetworkaudioModule } from './networkaudio/networkaudio.module';
import { WebglvisualizerModule } from './webglvisualizer/webglvisualizer.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NetworkaudioModule,
    WebglvisualizerModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
