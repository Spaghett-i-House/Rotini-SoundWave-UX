import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkaudioComponent } from './networkaudio.component';

describe('NetworkaudioComponent', () => {
  let component: NetworkaudioComponent;
  let fixture: ComponentFixture<NetworkaudioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkaudioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkaudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
