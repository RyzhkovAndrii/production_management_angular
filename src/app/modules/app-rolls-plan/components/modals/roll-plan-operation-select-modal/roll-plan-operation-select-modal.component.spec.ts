import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RollPlanOperationSelectModalComponent } from './roll-plan-operation-select-modal.component';

describe('RollPlanOperationSelectModalComponent', () => {
  let component: RollPlanOperationSelectModalComponent;
  let fixture: ComponentFixture<RollPlanOperationSelectModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RollPlanOperationSelectModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RollPlanOperationSelectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
