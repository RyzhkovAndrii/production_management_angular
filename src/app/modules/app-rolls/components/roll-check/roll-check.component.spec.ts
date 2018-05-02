import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RollCheckComponent } from './roll-check.component';

describe('RollCheckComponent', () => {
  let component: RollCheckComponent;
  let fixture: ComponentFixture<RollCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RollCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RollCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
