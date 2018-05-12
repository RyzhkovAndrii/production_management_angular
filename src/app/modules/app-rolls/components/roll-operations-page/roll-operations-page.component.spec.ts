import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RollOperationsPageComponent } from './roll-operations-page.component';

describe('RollOperationsPageComponent', () => {
  let component: RollOperationsPageComponent;
  let fixture: ComponentFixture<RollOperationsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RollOperationsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RollOperationsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
