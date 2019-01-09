import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductOperationSelectModalComponent } from './product-operation-select-modal.component';

describe('ProductPlanOperationSelectModalComponent', () => {
  let component: ProductOperationSelectModalComponent;
  let fixture: ComponentFixture<ProductOperationSelectModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductOperationSelectModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductOperationSelectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
