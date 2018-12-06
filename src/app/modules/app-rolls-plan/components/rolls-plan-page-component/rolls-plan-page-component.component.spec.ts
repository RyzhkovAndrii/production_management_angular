import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RollsPlanPageComponentComponent } from './rolls-plan-page-component.component';

describe('RollsPlanPageComponentComponent', () => {
  let component: RollsPlanPageComponentComponent;
  let fixture: ComponentFixture<RollsPlanPageComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RollsPlanPageComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RollsPlanPageComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
