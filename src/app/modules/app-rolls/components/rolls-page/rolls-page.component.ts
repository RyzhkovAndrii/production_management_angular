import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {
  Router,
  ActivatedRoute
} from '@angular/router';
import {
  ContextMenuComponent
} from 'ngx-contextmenu';
import {
  ModalDialogService,
  IModalDialogOptions
} from 'ngx-modal-dialog';
import * as moment from 'moment';

import {
  substructDays,
  midnightDate,
  addDays,
  formatDate,
  getIndex,
} from '../../../../app-utils/app-date-utils';
import {
  RollsService
} from '../../services/rolls.service';
import {
  compareColors
} from '../../../../app-utils/app-comparators';
import {
  RollTypeModalComponent
} from '../roll-type-modal/roll-type-modal.component';
import {
  RollOperationModalComponent
} from '../roll-operation-modal/roll-operation-modal.component';
import {
  CheckStatus
} from '../../../app-shared/enums/check-status.enum';
import {
  AppModalService
} from '../../../app-shared/services/app-modal.service';
import {
  SimpleConfirmModalComponent
} from '../../../app-shared/components/simple-confirm-modal/simple-confirm-modal.component';
import {
  StandardsService
} from '../../../app-standards/services/standards.service';
import {
  ProductsService
} from '../../../app-products/services/products.service';
import {
  Title
} from '@angular/platform-browser';

@Component({
  selector: 'app-rolls-page',
  templateUrl: './rolls-page.component.html',
  styleUrls: ['./rolls-page.component.css']
})
export class RollsPageComponent implements OnInit {
  daysHeader: Date[];
  dateHeader: string[];
  monthYearMap: Map < string,
  number > ;
  rollsInfo: RollInfo[] = [];
  daysInTable = 30;
  restDate: Date;
  fromDate: Date;
  toDate = midnightDate();
  rollChecks = new Map < number,
  RollCheck > ();
  totalLeftover: number;

  @ViewChild(ContextMenuComponent) public rollsMenu: ContextMenuComponent;

  @ViewChild('modification') modification;

  constructor(
    private rollsService: RollsService,
    private standardsService: StandardsService,
    private ngxModalService: ModalDialogService,
    private viewRef: ViewContainerRef,
    private router: Router,
    private route: ActivatedRoute,
    private appModalService: AppModalService,
    private productsService: ProductsService,
    private title: Title
  ) {
    this.title.setTitle('Рулоны');
  }

  ngOnInit() {
    this.showCurrentPeriod();
  }

  private initTableHeader(dateTo: Date) {
    this.toDate = dateTo;
    this.restDate = substructDays(dateTo, this.daysInTable);
    this.fromDate = substructDays(dateTo, this.daysInTable - 1);
    this.daysHeader = [];
    this.monthYearMap = new Map();
    for (let i = 0; i < this.daysInTable; i++) {
      const substructedDate = addDays(this.fromDate, i);
      this.daysHeader.push(substructedDate);
      const monthYear: string = moment(substructedDate).locale('ru').format('MMM YY');
      this.monthYearMap.set(monthYear, this.monthYearMap.has(monthYear) ? this.monthYearMap.get(monthYear) + 1 : 1);
    }
    this.dateHeader = Array.from(this.monthYearMap.keys());
  }

  private fetchData() {
    if (this.isPreviousPeriod()) {
      this.rollsService.getRollsInfoWithoutCheck(this.restDate, this.fromDate, this.toDate)
        .subscribe(data => {
          this.rollsInfo = data;
        }, error => this.appModalService.openHttpErrorModal(this.ngxModalService, this.viewRef, error));
    } else {
      this.rollsService.getRollsInfo(this.restDate, this.fromDate, this.toDate)
        .subscribe(data => {
          this.rollsInfo = data;
        }, error => this.appModalService.openHttpErrorModal(this.ngxModalService, this.viewRef, error));
    }
    this.rollsService.getTotalLeftover(this.toDate)
      .subscribe(data => this.totalLeftover = data,
          error => this.appModalService.openHttpErrorModal(this.ngxModalService, this.viewRef, error));
  }

  showPreviousPeriod() {
    this.initTableHeader(substructDays(this.toDate, this.daysInTable));
    this.fetchData();
  }

  showNextPeriod() {
    this.initTableHeader(addDays(this.toDate, this.daysInTable));
    this.fetchData();
  }

  isPreviousPeriod() {
    const accuracy = 10000;
    return this.toDate.getTime() + accuracy < midnightDate().getTime();
  }

  isBeforePreviousPeriod() {
    const accuracy = 10000;
    return this.toDate.getTime() + accuracy < substructDays(midnightDate(), this.daysInTable).getTime();
  }

  showCurrentPeriod() {
    this.initTableHeader(midnightDate());
    this.fetchData();
  }

  getBatch(rollBatch: RollBatch): number | string {
    return rollBatch ? rollBatch.leftOverAmount : '';
  }

  getBatches(rollBatches: RollBatch[]) {
    const result = new Array(this.daysInTable);
    rollBatches.forEach(item => result[getIndex(midnightDate(item.dateManufactured), result.length, (24 * 60 * 60 * 1000), this.toDate)] = item);
    return result;
  }

  getWeight(rollType: RollType): string | number {
    return rollType.minWeight === rollType.maxWeight ? rollType.minWeight : `${rollType.minWeight}–${rollType.maxWeight}`;
  }

  sortByColorThicknessRollId(rollsInfo: RollInfo[]): RollInfo[] {
    return rollsInfo.sort((a, b) => {
      const colorSortValue = compareColors(a.rollType.colorCode, b.rollType.colorCode);
      const thicknessSort = a.rollType.thickness - b.rollType.thickness;
      return colorSortValue !== 0 ? colorSortValue :
        thicknessSort !== 0 ? thicknessSort : a.rollType.id - b.rollType.id;
    });
  }

  openAddRollTypeModal() {
    const operation = (result: Promise < RollType > ) => {
      result
        .then((resolve: RollType) => {
          this.rollsService.postRollType(resolve, this.daysInTable, this.restDate, this.toDate)
            .subscribe(rollInfo => {
              this.rollsInfo.push(rollInfo);
              this.modification.reload();
            }, error => this.appModalService.openHttpErrorModal(this.ngxModalService, this.viewRef, error));
        }, reject => {});
    };
    const modalOptions: Partial < IModalDialogOptions < RollTypeModalData >> = {
      title: 'Новый рулон',
      childComponent: RollTypeModalComponent,
      data: {
        operation: operation.bind(this)
      }
    };
    this.ngxModalService.openDialog(this.viewRef, modalOptions);
  }

  openEditRollTypeModal(rollType: RollType) {
    this.standardsService.getStandardsByRollId(rollType.id)
      .subscribe(standards => {
        const operation = (result: Promise < RollType > ) => {
          result
            .then((resolve: RollType) => {
              resolve.id = rollType.id;
              this.rollsService.putRollType(resolve)
                .subscribe(x => {
                  rollType.id = x.id;
                  rollType.note = x.note;
                  rollType.colorCode = x.colorCode;
                  rollType.thickness = x.thickness;
                  rollType.minWeight = x.minWeight;
                  rollType.maxWeight = x.maxWeight;
                  rollType.length = x.length;
                  this.modification.reload();
                }, error => this.appModalService.openHttpErrorModal(this.ngxModalService, this.viewRef, error));
            }, reject => {});
        };
        const modalOptions: Partial < IModalDialogOptions < RollTypeModalData >> = {
          title: 'Редактирование рулона',
          childComponent: RollTypeModalComponent,
          data: {
            rollType: rollType,
            standards: standards,
            operation: operation.bind(this)
          }
        };
        this.ngxModalService.openDialog(this.viewRef, modalOptions);
      }, error => this.appModalService.openHttpErrorModal(this.ngxModalService, this.viewRef, error));
  }

  openCreateRollOperationModal(batch: RollBatch, index: number, rollTypeId: number) {
    const func = (result: Promise < RollOperationRequest > ) => {
      result
        .then((resolve: RollOperationRequest) => {
          this.rollsService.postRollOperation(resolve).subscribe(data => {
            this.fetchData();
            this.modification.reload();
          }, error => this.appModalService.openHttpErrorModal(this.ngxModalService, this.viewRef, error));
        }, reject => {});
    };
    this.productsService.getProductTypesByRollInNorms(rollTypeId)
      .subscribe(products => {
        const modalOptions: Partial < IModalDialogOptions < RollOperationModalData >> = {
          title: 'Операция над рулонами',
          childComponent: RollOperationModalComponent,
          data: {
            batch,
            rollTypeId,
            manufacturedDate: this.daysHeader[index],
            productsByRollInNorms: products,
            func: func.bind(this),
            openErrorModal: error => this.appModalService.openHttpErrorModal(this.ngxModalService, this.viewRef, error)
          }
        };
        this.ngxModalService.openDialog(this.viewRef, modalOptions);
      }, error => this.appModalService.openHttpErrorModal(this.ngxModalService, this.viewRef, error));
  }

  isReady(batch: RollBatch) {
    if (!batch) {
      return false;
    }
    return batch.readyToUse;
  }

  onChangeRollCheck(checkStatus: CheckStatus, rollCheck: RollCheck) {
    rollCheck.rollLeftOverCheckStatus = checkStatus;
    this.rollChecks.set(rollCheck.id, rollCheck);
  }

  submitRollChecks() {
    this.rollsService.putRollChecks(Array.from(this.rollChecks.values()))
      .subscribe(data => {
        if (data.length !== 0) {
          this.fetchData();
          this.rollChecks.clear();
        }
      }, error => this.appModalService.openHttpErrorModal(this.ngxModalService, this.viewRef, error));
  }

  openRollOperationsPage(item: RollType) {
    this.router.navigate(['operations'], {
      relativeTo: this.route,
      queryParams: {
        'roll_type_id': item.id,
        'from': formatDate(this.fromDate),
        'to': formatDate(this.toDate)
      }
    });
  }

  openDeleteRollTypeModal(item: RollType) {
    const buttonClass = 'btn btn-outline-dark';
    const modalOptions: Partial < IModalDialogOptions < any >> = {
      title: 'Подтвердите удаление рулона',
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
            this.rollsService.deleteRollType(item.id)
              .subscribe(data => {
                this.rollsInfo = this.rollsInfo.filter((value, index, array) => value.rollType.id !== item.id);
                this.modification.reload();
              }, error => this.appModalService.openHttpErrorModal(this.ngxModalService, this.viewRef, error));
            return true;
          }
        }
      ]
    };
    this.ngxModalService.openDialog(this.viewRef, modalOptions);
  }
}
