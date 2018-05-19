import {
  Component,
  OnInit,
  ViewContainerRef
} from '@angular/core';
import {
  FormGroup, FormControl, Validators
} from '@angular/forms';
import {
  ModalDialogService,
  IModalDialogOptions
} from 'ngx-modal-dialog';

import {
  ProductsService
} from '../../services/products.service';
import {
  getDateFirstDayOfMonth,
  midnightDate,
  formatDate,
  formatDateServerToBrowser,
  getDate
} from '../../../../app-utils/app-date-utils';
import {
  AppModalService
} from '../../../app-shared/services/app-modal.service';
import {
  ProductTypeModalComponent
} from '../product-type-modal/product-type-modal.component';
import {
  SimpleConfirmModalComponent
} from '../../../app-shared/components/simple-confirm-modal/simple-confirm-modal.component';
import {
  ProductOperationModalComponent
} from '../product-operation-modal/product-operation-modal.component';
import {
  compareColors
} from '../../../../app-utils/app-comparators';

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.css']
})
export class ProductsPageComponent implements OnInit {

  productsInfo: ProductInfo[][] = [];
  daylyDate: Date;
  toDate: Date;
  fromDate: Date;

  form: FormGroup;

  private readonly COLLATOR = new Intl.Collator([], {
    sensitivity: "base"
  });

  constructor(private productsService: ProductsService,
    private viewRef: ViewContainerRef,
    private ngxModalDialogService: ModalDialogService,
    private appModalService: AppModalService) {
    this.daylyDate = midnightDate();
    this.toDate = midnightDate();
    this.fromDate = getDateFirstDayOfMonth(this.daylyDate);
  }

  ngOnInit() {
    this.form = new FormGroup({
      daylyDate: new FormControl(formatDateServerToBrowser(formatDate(this.daylyDate)), Validators.required)
    });
    this.fetchData();
  }

  fetchData() {
    this.productsService.getProductsInfo(this.daylyDate, this.fromDate, this.toDate)
      .subscribe(data => {
        console.log(data);
        this.productsInfo = data;
      }, error => {
        this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error);
      });
  }

  changeDateAndFetch() {
    console.log(this.form);
    this.daylyDate = getDate(this.form.value.daylyDate, 'YYYY-MM-DD')
  }

  sortByColor(array: ProductInfo[][]): ProductInfo[][] {
    return array.sort((a, b) => {
      const byColor = compareColors(a[0].type.colorCode, b[0].type.colorCode);
      return byColor != 0 ? byColor : 1;
    });
  }

  sortByNameAndWeight(array: ProductInfo[]): ProductInfo[] {
    return array.sort((a, b) => {
      const byName = this.COLLATOR.compare(a.type.name, b.type.name);
      return byName != 0 ? byName : a.type.weight - b.type.weight;
    });
  }

  getSectionTotals(values: ProductInfo[]): number[] {
    return values.reduce((previousValue, currentValue, currentIndex, array) => {
      previousValue[0] += currentValue.restLeftover.amount;
      previousValue[1] += currentValue.dayBatch.manufacturedAmount || 0;
      previousValue[2] += currentValue.monthBatch.manufacturedAmount || 0;
      previousValue[3] += currentValue.dayBatch.soldAmount || 0;
      previousValue[4] += currentValue.monthBatch.soldAmount || 0;
      previousValue[5] += currentValue.currentLeftover.amount;
      return previousValue;
    }, new Array(6).fill(0, 0));
  }

  getTotals(): number[] {
    return this.productsInfo.reduce((previousValue, currentValue, currentIndex, array) => {
      const sectionTotals = this.getSectionTotals(currentValue);
      return previousValue.map((value, index, array) => array[index] += sectionTotals[index]);
    }, new Array(6).fill(0, 0));
  }

  openAddProductTypeModal() {
    const operation = (result: Promise < ProductTypeRequest > ) => {
      result
        .then((resolve: ProductTypeRequest) => {
          this.productsService.postProductType(resolve)
            .subscribe(data => this.fetchData(), error => this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error));
        }, reject => {});
    };
    const modalOptions: Partial < IModalDialogOptions < ProductTypeModalData >> = {
      title: 'Новая продукция',
      childComponent: ProductTypeModalComponent,
      data: {
        operation: operation.bind(this)
      }
    };
    this.ngxModalDialogService.openDialog(this.viewRef, modalOptions);
  }

  openEditProductTypeModal(productType: ProductTypeResponse) {
    const operation = (result: Promise < ProductTypeRequest > ) => {
      result
        .then((resolve: ProductTypeRequest) => {
          this.productsService.putProductType(productType.id, resolve)
            .subscribe(data => this.fetchData(), error => this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error));
        }, reject => {});
    };
    const modalOptions: Partial < IModalDialogOptions < ProductTypeModalData >> = {
      title: 'Редактирование продукции',
      childComponent: ProductTypeModalComponent,
      data: {
        productType: {
          name: productType.name,
          weight: productType.weight,
          colorCode: productType.colorCode
        },
        operation: operation.bind(this)
      }
    };
    this.ngxModalDialogService.openDialog(this.viewRef, modalOptions);
  }

  openAddProductOperation(productTypeId: number, operationType: string) {
    const func = (result: Promise < ProductOperationRequest > ) => {
      result
        .then((resolve: ProductOperationRequest) => {
          this.productsService.postProductOperation(resolve)
            .subscribe(data => this.fetchData(), error => this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error));
        }, reject => {});
    }
    const modalOptions: Partial < IModalDialogOptions < ProductOperationModalData >> = {
      title: 'Операция над продукцией',
      childComponent: ProductOperationModalComponent,
      data: {
        productOperationRequest: {
          operationDate: formatDate(this.daylyDate),
          productTypeId,
          operationType,
          amount: undefined
        },
        func
      }
    };
    this.ngxModalDialogService.openDialog(this.viewRef, modalOptions);
  }

  openDeleteProductTypeModal(productType: ProductTypeResponse) {
    const buttonClass = 'btn btn-outline-dark';
    const modalOptions: Partial < IModalDialogOptions < any >> = {
      title: 'Подтвердите удаление продукции',
      childComponent: SimpleConfirmModalComponent,
      actionButtons: [{
          text: 'Отменить',
          buttonClass,
          onAction: () => true
        },
        {
          text: 'Удалить',
          buttonClass,
          onAction: () => {
            this.productsService.deleteProductType(productType.id).subscribe(data => this.fetchData(), error => {
              this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error)
            });
            return true;
          }
        }
      ]
    };
    this.ngxModalDialogService.openDialog(this.viewRef, modalOptions);
  }
}
