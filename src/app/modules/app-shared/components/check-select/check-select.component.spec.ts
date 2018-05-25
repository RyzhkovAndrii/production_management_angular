import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckSelectComponent } from './check-select.component';

describe('CheckSelectComponent', () => {
  let component: CheckSelectComponent;
  let fixture: ComponentFixture<CheckSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
