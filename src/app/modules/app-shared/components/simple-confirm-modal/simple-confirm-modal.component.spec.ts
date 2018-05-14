import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleConfirmModalComponent } from './simple-confirm-modal.component';

describe('SimpleConfirmModalComponent', () => {
  let component: SimpleConfirmModalComponent;
  let fixture: ComponentFixture<SimpleConfirmModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleConfirmModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
