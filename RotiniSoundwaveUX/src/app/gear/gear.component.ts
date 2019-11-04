import { Component, OnInit, Output, EventEmitter } from '@angular/core';

/**
 * Manages the gear that opens the sidebar
 */
@Component({
  selector: 'app-gear',
  templateUrl: './gear.component.html',
  styleUrls: ['./gear.component.css']
})
export class GearComponent implements OnInit {
  @Output() onClick = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

  /**
   * onClickButton Handles a clicking of the sidebar button gear
   * @param event 
   */
  onClickButton(event){
    this.onClick.emit(event);
  }

}
