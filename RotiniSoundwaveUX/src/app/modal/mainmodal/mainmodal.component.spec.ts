import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainmodalComponent } from './mainmodal.component';

describe('MainmodalComponent', () => {
  let component: MainmodalComponent;
  let fixture: ComponentFixture<MainmodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainmodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
