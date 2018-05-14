import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductOperationModalComponent } from './product-operation-modal.component';

describe('ProductOperationModalComponent', () => {
  let component: ProductOperationModalComponent;
  let fixture: ComponentFixture<ProductOperationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductOperationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductOperationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
