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
  RollsPlanService
} from '../../services/rolls-plan.service';
import {
  AppModalService
} from '../../../app-shared/services/app-modal.service';
import {
  midnightDate,
  addDays,
  isSameDate,
  getDate
} from '../../../../app-utils/app-date-utils';
import {
  compareColors
} from '../../../../app-utils/app-comparators';
import {
  RollPlanOperationModalComponent
} from '../modals/roll-plan-operation-modal/roll-plan-operation-modal.component';
import {
  RollPlanOperationSelectModalComponent
} from '../modals/roll-plan-operation-select-modal/roll-plan-operation-select-modal.component';
import {
  SimpleConfirmModalComponent
} from '../../../app-shared/components/simple-confirm-modal/simple-confirm-modal.component';

@Component({
  selector: 'app-rolls-plan-page-component',
  templateUrl: './rolls-plan-page-component.component.html',
  styleUrls: ['./rolls-plan-page-component.component.css']
})
export class RollsPlanPageComponentComponent implements OnInit {

  currentDate: Date;
  fromDate: Date;
  toDate: Date;
  rollssPlanInfo: RollPlanInfo[] = [];

  firstWeekHeaderDates: Date[] = [];
  secondWeekHeaderDates: Date[] = [];
  secondMonthIndex: number = -1;
  readonly DATE_HEADER_SIZE: number = 7;

  constructor(
    private rollsPlanService: RollsPlanService,
    private ngxModalService: ModalDialogService,
    private viewRef: ViewContainerRef,
    private appModalService: AppModalService) {}

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.initDateHeaders();
    this.rollsPlanService.getRollPlansInfo(this.currentDate, this.toDate)
      .subscribe(
        data => {
          console.log(data);
          this.rollssPlanInfo = data
        },
        error => this.appModalService.openHttpErrorModal(this.ngxModalService, this.viewRef, error)
      );
  }

  private initDateHeaders() {
    this.currentDate = midnightDate();
    this.fromDate = this.currentDate;
    this.toDate = addDays(this.currentDate, 14);
    this.firstWeekHeaderDates = [];
    this.secondWeekHeaderDates = [];
    for (let i = 0; i < this.DATE_HEADER_SIZE; i++) {
      this.firstWeekHeaderDates.push(addDays(this.currentDate, i));
      if (this.secondMonthIndex == -1 && this.fromDate.getMonth() < this.firstWeekHeaderDates[i].getMonth()) {
        this.secondMonthIndex = i;
      }
    }
    for (let i = this.DATE_HEADER_SIZE; i < this.DATE_HEADER_SIZE * 2; i++) {
      this.secondWeekHeaderDates.push(addDays(this.currentDate, i));
      if (this.secondMonthIndex == -1 && this.firstWeekHeaderDates[this.firstWeekHeaderDates.length - 1].getMonth() < this.secondWeekHeaderDates[i - this.DATE_HEADER_SIZE].getMonth()) {
        this.secondMonthIndex = i;
      }
    }
  }

  isFirstInOneMoth() {
    return this.secondMonthIndex > 6 || this.secondMonthIndex < 0;
  }

  isSecondInOneMoth() {
    return this.secondMonthIndex < this.firstWeekHeaderDates.length;
  }

  findBatch(batches: RollPlanBatchResponse[], colDate: Date): RollPlanBatchResponse {
    return batches.find(x => isSameDate(colDate, getDate(x.date)));
  }

  getBatches(batches: RollPlanBatchResponse[], offset: number = 0): RollPlanBatchResponse[] {
    const result = batches.slice(offset, offset + this.DATE_HEADER_SIZE);
    return result;
  }

  getWeight(rollType: RollType): string | number {
    return rollType.minWeight === rollType.maxWeight ? rollType.minWeight : `${rollType.minWeight}–${rollType.maxWeight}`;
  }
  sortByColorThicknessRollId(rollsInfo: RollPlanInfo[]): RollPlanInfo[] {
    return rollsInfo.sort((a, b) => {
      const colorSortValue = compareColors(a.rollType.colorCode, b.rollType.colorCode);
      const thicknessSort = a.rollType.thickness - b.rollType.thickness;
      return colorSortValue !== 0 ? colorSortValue :
        thicknessSort !== 0 ? thicknessSort : a.rollType.id - b.rollType.id;
    });
  }
  openCreatePlanModal(item: RollPlanModalPrefetchData) {
    const func: (result: Promise < RollPlanOperationRequest > ) => void = result => {
      result.then(request => {
        this.rollsPlanService.postOperation(request)
          .subscribe(
            response => this.initData(),
            error => this.appModalService.openHttpErrorModal(this.ngxModalService, this.viewRef, error)
          );
      }, reject => {})
    };
    const planData: RollPlanOperationModalData = {
      batch: item.batch,
      func
    }
    const options: Partial < IModalDialogOptions < RollPlanOperationModalData >> = {
      data: planData,
      title: 'Создание плановой операции',
      childComponent: RollPlanOperationModalComponent
    }
    this.ngxModalService.openDialog(this.viewRef, options);
  }

  openSelectEditPlanModal(item: RollPlanModalPrefetchData) {
    this.rollsPlanService.getOperationsByRoll(item.batch.rollTypeId, item.batch.date, item.batch.date)
      .subscribe(operations => {
        if (operations.length > 1) {
          const data: RollPlanOperationSelectModalData = {
            operations,
            action: (result: Promise < RollPlanOperationResponse > ) => result.then(operation => this.openEditPlanModal(operation, item))
          };
          const options: Partial < IModalDialogOptions < RollPlanOperationSelectModalData >> = {
            data,
            title: 'Выбор операции для редактирования',
            childComponent: RollPlanOperationSelectModalComponent
          }
          this.ngxModalService.openDialog(this.viewRef, options);
        } else {
          this.openEditPlanModal(operations[0], item);
        }
      }, error => this.appModalService.openHttpErrorModal(this.ngxModalService, this.viewRef, error));
  }

  openEditPlanModal(operation: RollPlanOperationResponse, item: RollPlanModalPrefetchData) {
    const func: (result: Promise < RollPlanOperationRequest > ) => void = result => {
      result.then(request => {
        this.rollsPlanService.putOperation(operation.id, request)
          .subscribe(
            response => this.initData(),
            error => this.appModalService.openHttpErrorModal(this.ngxModalService, this.viewRef, error)
          );
      }, reject => {})
    };
    const planData: RollPlanOperationModalData = {
      batch: item.batch,
      operation,
      func
    }
    const options: Partial < IModalDialogOptions < RollPlanOperationModalData >> = {
      data: planData,
      title: 'Редактирование плановой операции',
      childComponent: RollPlanOperationModalComponent
    }
    this.ngxModalService.openDialog(this.viewRef, options);
  }

  openSelectDeletePlanModal(item: RollPlanModalPrefetchData) {
    console.log(item);
    this.rollsPlanService.getOperationsByRoll(item.batch.rollTypeId, item.batch.date, item.batch.date)
      .subscribe(operations => {
        if (operations.length > 1) {
          const data: RollPlanOperationSelectModalData = {
            operations,
            action: (result: Promise < RollPlanOperationResponse > ) => result.then(operation => this.openDeletePlanModal(operation))
          };
          const options: Partial < IModalDialogOptions < RollPlanOperationSelectModalData >> = {
            data,
            title: 'Выбор операции для удаления',
            childComponent: RollPlanOperationSelectModalComponent
          }
          this.ngxModalService.openDialog(this.viewRef, options);
        } else {
          this.openDeletePlanModal(operations[0]);
        }
      }, error => this.appModalService.openHttpErrorModal(this.ngxModalService, this.viewRef, error));
  }

  openDeletePlanModal(operation: RollPlanOperationResponse) {
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
            this.rollsPlanService.deleteOperation(operation.id)
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

  isEmptyBatch = (item: RollPlanModalPrefetchData): boolean => {
    return item.batch && item.batch.manufacturedAmount != 0;
  }
}
