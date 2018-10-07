import {
  Component,
  OnInit,
  ViewContainerRef
} from '@angular/core';
import {
  ModalDialogService,
  IModalDialogOptions
} from 'ngx-modal-dialog';

import {
  ProductsPlanService
} from '../../services/products-plan.service';
import {
  midnightDate,
  addDays,
  getIndex,
  formatDate
} from '../../../../app-utils/app-date-utils';
import {
  AppModalService
} from '../../../app-shared/services/app-modal.service';
import {
  compareColors
} from '../../../../app-utils/app-comparators';
import {
  StandardsService
} from '../../../app-standards/services/standards.service';
import {
  ProductPlanOperationModalComponent
} from '../modals/product-plan-operation-modal/product-plan-operation-modal.component';
import {
  ProductPlanOperationSelectModalComponent
} from '../modals/product-plan-operation-select-modal/product-plan-operation-select-modal.component';
import {
  SimpleConfirmModalComponent
} from '../../../app-shared/components/simple-confirm-modal/simple-confirm-modal.component';

@Component({
  selector: 'app-products-plan-page',
  templateUrl: './products-plan-page.component.html',
  styleUrls: ['./products-plan-page.component.css']
})
export class ProductsPlanPageComponent implements OnInit {

  currentDate: Date;
  fromDate: Date;
  toDate: Date;
  productsPlanInfo: ProductPlanInfo[] = [];

  headerDates: Date[] = [];
  secondMonthIndex: number = -1;
  readonly DATE_HEADER_SIZE: number = 7;

  constructor(
    private productsPlanService: ProductsPlanService,
    private standardService: StandardsService,
    private ngxModalService: ModalDialogService,
    private viewRef: ViewContainerRef,
    private appModalService: AppModalService
  ) {}

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.initDateHeaders();
    this.productsPlanService.getProductPlanInfo(this.currentDate, this.toDate)
      .subscribe(
        data => this.productsPlanInfo = data,
        error => this.appModalService.openHttpErrorModal(this.ngxModalService, this.viewRef, error)
      );
  }

  private initDateHeaders() {
    this.currentDate = midnightDate();
    this.fromDate = addDays(this.currentDate, 1);
    this.toDate = addDays(this.currentDate, this.DATE_HEADER_SIZE);
    for (let i = 0; i < this.DATE_HEADER_SIZE; i++) {
      this.headerDates[i] = addDays(this.currentDate, i + 1);
      if (this.secondMonthIndex == -1 && this.fromDate.getMonth() < this.headerDates[i].getMonth()) {
        this.secondMonthIndex = i;
      }
    }
  }

  sortProductsInfo(productsPlanInfo: ProductPlanInfo[]): ProductPlanInfo[] {
    return productsPlanInfo.sort((a, b) => {
      let sort = compareColors(a.productType.colorCode, b.productType.colorCode);
      sort = sort == 0 ?
        a.productType.name.localeCompare(b.productType.name) != 0 ? a.productType.name.localeCompare(b.productType.name) :
        a.productType.weight - b.productType.weight == 0 ? a.productType.id - b.productType.id : a.productType.weight - b.productType.weight :
        sort;
      return sort;
    });
  }

  isFirstInOneMonth() {
    return this.secondMonthIndex > 6 || this.secondMonthIndex < 0;
  }

  getBatches(planBatches: ProductPlanBatchResponse[]): ProductPlanBatchResponse[] {
    const result = new Array(this.DATE_HEADER_SIZE);
    planBatches.forEach(item => result[getIndex(midnightDate(item.date), result.length, (24 * 60 * 60 * 1000), this.toDate)] = item);
    return result;
  }

  openCreatePlanModal(data: ProductPlanModalPrefetchData) {
    const func: (result: Promise < ProductPlanOperationRequest > ) => void = result => {
      result.then(resolve => {
        this.productsPlanService.postOperation(resolve).subscribe(operation => {
          this.initData();
        });
      }, reject => {});
    }
    this.standardService.getStandardWithRolls(data.product.id)
      .subscribe(standardWithRolls => {
        const modalData: ProductPlanOperationModalData = {
          productType: data.product,
          batch: data.batch,
          date: formatDate(this.headerDates[data.index]),
          standard: standardWithRolls,
          func
        };
        const options: Partial < IModalDialogOptions < ProductPlanOperationModalData >> = {
          data: modalData,
          title: 'Создание планового производства',
          childComponent: ProductPlanOperationModalComponent
        }
        this.ngxModalService.openDialog(this.viewRef, options);
      }, (error: string[]) => {
        if (error.length > 0 && error[0].endsWith('404') && error[1].toLowerCase().includes('norm')) {
          error = ['Для данной продукции не создан норматив!']
        }
        this.appModalService.openHttpErrorModal(this.ngxModalService, this.viewRef, error)
      });
  }

  openSelectEditPlanModal(data: ProductPlanModalPrefetchData) {
    const func: (p: Promise < ProductPlanOperationWithRoll > ) => void = p => {
      p.then(resolve => {
        console.log(resolve);
      }, reject => {});
    }
    this.openSelectPlanModal(data, 'Выбор операции для редактирования', func.bind(this));
  }

  openSelectPlanModal(data: ProductPlanModalPrefetchData, title: string,
    action: (p: Promise < ProductPlanOperationWithRoll > ) => void) {
    const date = formatDate(this.headerDates[data.index]);
    this.productsPlanService.getOperationsByProductWithRoll(data.product.id, date)
      .subscribe(operations => {
        if (operations.length == 1) {
          action(Promise.resolve(operations[0]));
        } else {
          const data: ProductPlanOperationSelectModalData = {
            operations,
            action
          }
          const options: Partial < IModalDialogOptions < ProductPlanOperationSelectModalData >> = {
            data,
            title,
            childComponent: ProductPlanOperationSelectModalComponent
          }
          this.ngxModalService.openDialog(this.viewRef, options);
        }
      }, error => this.appModalService.openHttpErrorModal(this.ngxModalService, this.viewRef, error));
  }

  openSelectDeletePlanModal(data: ProductPlanModalPrefetchData) {
    const func: (p: Promise < ProductPlanOperationWithRoll > ) => void = p => {
      p.then(resolve => {
        this.openDeletePlanOperationModal(resolve.id);
      }, reject => {});
    }
    this.openSelectPlanModal(data, 'Выбор операции для удаления', func.bind(this));
  }

  openDeletePlanOperationModal(operationId: number) {
    const buttonClass = 'btn btn-outline-dark';
    const modalOptions: Partial < IModalDialogOptions < any > > = {
      title: 'Подтвердите удаление операции',
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
            this.productsPlanService.deleteOperation(operationId)
              .subscribe(data => {
                this.initData();
              }, error => this.appModalService.openHttpErrorModal(this.ngxModalService, this.viewRef, error));
            return true;
          }
        }
      ]
    }
    this.ngxModalService.openDialog(this.viewRef, modalOptions);
  }

  isBatchExist = (item: ProductPlanModalPrefetchData): boolean => {
    return item.batch && item.batch.manufacturedAmount != 0 ? true : false;
  }
}
