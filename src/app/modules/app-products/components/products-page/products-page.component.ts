import {
  Component,
  OnInit,
  ViewContainerRef,
  ViewChild
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators
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
  getDate,
  getDateLastDayOfMotth,
  isSameMonthYear
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
import {
  validateDateNotAfterCurrent
} from '../../../../app-utils/app-validators';
import {
  CheckStatus
} from '../../../app-shared/enums/check-status.enum';
import {
  StandardsService
} from '../../../app-standards/services/standards.service';
import {
  Title
} from '@angular/platform-browser';
import {
  ProductOperationType
} from '../../enums/product-operation-type.enum';
import {
  ProductOperationSelectModalComponent
} from '../product-operation-select-modal/product-operation-select-modal.component';

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
  productChecks: Map < number,
  ProductCheckResponse > = new Map();

  form: FormGroup;

  @ViewChild('modification') modification;

  private readonly COLLATOR = new Intl.Collator([], {
    sensitivity: "base"
  });

  constructor(
    private productsService: ProductsService,
    private standardsService: StandardsService,
    private viewRef: ViewContainerRef,
    private ngxModalDialogService: ModalDialogService,
    private appModalService: AppModalService,
    private title: Title
  ) {
    this.title.setTitle('Продукция');
  }

  ngOnInit() {
    this.form = new FormGroup({
      daylyDate: new FormControl(formatDateServerToBrowser(formatDate(midnightDate())), [
        Validators.required,
        validateDateNotAfterCurrent
      ])
    });
    this.loadTable();
  }

  loadTable() {
    this.initDates();
    this.fetchData();
  }

  initDates() {
    this.daylyDate = getDate(this.form.value.daylyDate, 'YYYY-MM-DD');
    this.fromDate = getDateFirstDayOfMonth(this.daylyDate);
    if (this.isCurrentPeriod()) {
      this.toDate = midnightDate();
    } else {
      this.toDate = getDateLastDayOfMotth(this.daylyDate);
    }
  }

  isCurrentPeriod() {
    return isSameMonthYear(this.daylyDate, midnightDate());
  }

  fetchData() {
    this.productsService.getProductsInfo(this.daylyDate, this.fromDate, this.toDate)
      .subscribe(data => {
        this.productsInfo = data;
        this.modification.reload();
      }, error => {
        this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error);
      });
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
    const func = (standard ? : Standard) => {
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
          standard,
          operation: operation.bind(this)
        }
      };
      this.ngxModalDialogService.openDialog(this.viewRef, modalOptions);
    }

    this.standardsService.getStandard(productType.id)
      .subscribe(standard => {
        func(standard);
      }, error => {
        if (( < string > error[0]).includes('404')) {
          func();
        } else {
          this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error)
        }
      });
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
      childComponent: ProductOperationModalComponent
    };
    this.productsService.getProductLeftover(productTypeId, this.daylyDate)
      .subscribe(leftover => {
        modalOptions.data = {
          productOperationRequest: {
            operationDate: formatDate(this.daylyDate),
            productTypeId,
            operationType,
            amount: undefined
          },
          productLeftover: leftover,
          func
        }
        this.ngxModalDialogService.openDialog(this.viewRef, modalOptions);
      }, error => this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error));
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

  onChangeProductCheck(checkStatus: CheckStatus, productCheck: ProductCheckResponse) {
    productCheck.productLeftOverCheckStatus = checkStatus;
    this.productChecks.set(productCheck.id, productCheck);
  }

  submitProductChecks() {
    this.productsService.putProductChecks(Array.from(this.productChecks.values()))
      .subscribe(data => {
        if (data.length != 0) {
          this.fetchData();
          this.productChecks.clear();
        }
      }, error => this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error));
  }

  openSelectEditOperationModal(item: ProductOperationsPrefetchData) {
    this.productsService.getOperations(item.batch.productTypeId, this.daylyDate, this.daylyDate)
      .subscribe(data => {
        const operations = data.filter(x => x.operationType == item.operationType);
        if (operations.length == 1) {
          this.openEditOperationModal(operations[0]);
        } else {
          const options: Partial < IModalDialogOptions < ProductOperationSelectModalData > > = {
            title: 'Операции для редактирования',
            childComponent: ProductOperationSelectModalComponent,
            data: {
              operations,
              action: (p: Promise < ProductOperationResponse > ) => {
                p.then(operation => this.openEditOperationModal(operation));
              }
            }
          }
          this.ngxModalDialogService.openDialog(this.viewRef, options)
        }
      }, error => this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error));
  }

  openEditOperationModal(operation: ProductOperationResponse) {
    console.log(operation);
  }

  openSelectDeleteOperationModal(item: ProductOperationsPrefetchData) {
    this.productsService.getOperations(item.batch.productTypeId, this.daylyDate, this.daylyDate)
      .subscribe(data => {
        const operations = data.filter(x => x.operationType == item.operationType);
        if (operations.length == 1) {
          this.openEditOperationModal(operations[0]);
        } else {
          const options: Partial < IModalDialogOptions < ProductOperationSelectModalData > > = {
            title: 'Операции для удаления',
            childComponent: ProductOperationSelectModalComponent,
            data: {
              operations,
              action: (p: Promise < ProductOperationResponse > ) => {
                p.then(operation => this.openDeleteOperationModal(operation));
              }
            }
          }
          this.ngxModalDialogService.openDialog(this.viewRef, options)
        }
      }, error => this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error));
  }

  openDeleteOperationModal(operation: ProductOperationResponse) {
    console.log(operation);
  }

  hasOperations = (item: ProductOperationsPrefetchData): boolean => {
    return (item.operationType == ProductOperationType.MANUFACTURED && item.batch.manufacturedAmount != 0) ||
      (item.operationType == ProductOperationType.SOLD && item.batch.soldAmount != 0);
  }
}
