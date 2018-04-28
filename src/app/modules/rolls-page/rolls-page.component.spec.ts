import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RollsPageComponent } from './rolls-page.component';

describe('RollPageComponent', () => {
  let component: RollsPageComponent;
  let fixture: ComponentFixture<RollsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RollsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RollsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
