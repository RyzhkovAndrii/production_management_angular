import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardsPageComponent } from './standards-page.component';

describe('StandardsPageComponent', () => {
  let component: StandardsPageComponent;
  let fixture: ComponentFixture<StandardsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StandardsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
