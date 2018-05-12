import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RollOperationModalComponent } from './roll-operation-modal.component';

describe('RollOperationModalComponent', () => {
  let component: RollOperationModalComponent;
  let fixture: ComponentFixture<RollOperationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RollOperationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RollOperationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
