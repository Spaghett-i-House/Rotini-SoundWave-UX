import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizercanvasComponent } from './visualizercanvas.component';

describe('VisualizercanvasComponent', () => {
  let component: VisualizercanvasComponent;
  let fixture: ComponentFixture<VisualizercanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizercanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizercanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
