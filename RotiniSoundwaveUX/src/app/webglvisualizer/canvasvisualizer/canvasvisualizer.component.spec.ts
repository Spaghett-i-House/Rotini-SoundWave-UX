import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasvisualizerComponent } from './canvasvisualizer.component';

describe('CanvasvisualizerComponent', () => {
  let component: CanvasvisualizerComponent;
  let fixture: ComponentFixture<CanvasvisualizerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanvasvisualizerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasvisualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
