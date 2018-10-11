import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPlanOperationSelectModalComponent } from './product-plan-operation-select-modal.component';

describe('ProductPlanOperationSelectModalComponent', () => {
  let component: ProductPlanOperationSelectModalComponent;
  let fixture: ComponentFixture<ProductPlanOperationSelectModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductPlanOperationSelectModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPlanOperationSelectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
