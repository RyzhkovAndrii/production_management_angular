import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsPlanPageComponent } from './products-plan-page.component';

describe('ProductsPlanPageComponent', () => {
  let component: ProductsPlanPageComponent;
  let fixture: ComponentFixture<ProductsPlanPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsPlanPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsPlanPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
