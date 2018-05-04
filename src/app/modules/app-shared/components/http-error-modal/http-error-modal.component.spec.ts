import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpErrorModalComponent } from './http-error-modal.component';

describe('HttpErrorModalComponent', () => {
  let component: HttpErrorModalComponent;
  let fixture: ComponentFixture<HttpErrorModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HttpErrorModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HttpErrorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
