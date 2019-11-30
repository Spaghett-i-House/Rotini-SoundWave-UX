import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenucontrollerComponent } from './menucontroller.component';

describe('MenucontrollerComponent', () => {
  let component: MenucontrollerComponent;
  let fixture: ComponentFixture<MenucontrollerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenucontrollerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenucontrollerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
