import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRollTypeModalComponent } from './add-roll-type-modal.component';

describe('AddRollTypeModalComponent', () => {
  let component: AddRollTypeModalComponent;
  let fixture: ComponentFixture<AddRollTypeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRollTypeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRollTypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
