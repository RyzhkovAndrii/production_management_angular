import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RollTypeModalComponent } from './roll-type-modal.component';

describe('AddRollTypeModalComponent', () => {
  let component: RollTypeModalComponent;
  let fixture: ComponentFixture<RollTypeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RollTypeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RollTypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
