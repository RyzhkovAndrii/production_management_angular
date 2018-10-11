import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPlanOperationModalComponent } from './product-plan-operation-modal.component';

describe('ProductPlanOperationModalComponent', () => {
  let component: ProductPlanOperationModalComponent;
  let fixture: ComponentFixture<ProductPlanOperationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductPlanOperationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPlanOperationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
