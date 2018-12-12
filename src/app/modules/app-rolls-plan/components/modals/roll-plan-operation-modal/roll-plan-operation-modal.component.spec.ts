import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RollPlanOperationModalComponent } from './roll-plan-operation-modal.component';

describe('RollOperationModalComponent', () => {
  let component: RollPlanOperationModalComponent;
  let fixture: ComponentFixture<RollPlanOperationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RollPlanOperationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RollPlanOperationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
