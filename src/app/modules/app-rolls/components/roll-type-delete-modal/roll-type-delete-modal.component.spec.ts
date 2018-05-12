import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RollTypeDeleteModalComponent } from './roll-type-delete-modal.component';

describe('RollTypeDeleteModalComponent', () => {
  let component: RollTypeDeleteModalComponent;
  let fixture: ComponentFixture<RollTypeDeleteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RollTypeDeleteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RollTypeDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
