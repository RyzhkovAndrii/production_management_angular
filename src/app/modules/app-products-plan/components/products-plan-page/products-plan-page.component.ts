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
      this.headerDates.push(addDays(this.currentDate, i + 1));
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

  openCreatePlanModal(data: {
    product: ProductTypeResponse,
    batch: ProductPlanBatchResponse,
    index: number
  }) {
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
      }, error => this.appModalService.openHttpErrorModal(this.ngxModalService, this.viewRef, error));
  }

  openEditPlanModal(planBatch: ProductPlanBatchResponse) {
    console.log(planBatch);
  }

  openDeletePlanModal(planBatch: ProductPlanBatchResponse) {
    console.log(planBatch);
  }
}
