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
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';
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
  getDifferenceInDays,
  getDate
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
  HttpErrorModalComponent
} from '../../../app-shared/components/http-error-modal/http-error-modal.component';
import {
  CheckStatus
} from '../../enums/check-status.enum';


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

  @ViewChild(ContextMenuComponent) public rollsMenu: ContextMenuComponent;

  private readonly DAYS_TO_READY = 15;

  constructor(
    private rollsService: RollsService,
    private ngxModalService: ModalDialogService,
    private viewRef: ViewContainerRef,
    private router: Router,
    private route: ActivatedRoute) {}

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

  private fetchTableData() {
    if (this.isPreviousPeriod()) {
      this.rollsService.getRollsInfoWithoutCheck(this.restDate, this.fromDate, this.toDate)
        .subscribe(data => {
          this.rollsInfo = data;
        }, error => this.openHttpErrorModal(error));
    } else {
      this.rollsService.getRollsInfo(this.restDate, this.fromDate, this.toDate)
        .subscribe(data => {
          this.rollsInfo = data;
        }, error => this.openHttpErrorModal(error));
    }
  }


  showPreviousPeriod() {
    this.initTableHeader(substructDays(this.toDate, this.daysInTable));
    this.fetchTableData();
  }

  showNextPeriod() {
    this.initTableHeader(addDays(this.toDate, this.daysInTable));
    this.fetchTableData();
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
    this.fetchTableData();
  }

  getBatch(rollBatch: RollBatch): number | string {
    if (rollBatch) return rollBatch.leftOverAmount;
    else return '';
  }

  getBatches(rollBatches: RollBatch[]) {
    const result = new Array(this.daysInTable);
    rollBatches.forEach(item => result[getIndex(midnightDate(item.dateManufactured), result.length, (24 * 60 * 60 * 1000), this.toDate)] = item);
    return result;
  }

  getWeight(rollType: RollType): string | number {
    return rollType.minWeight == rollType.maxWeight ? rollType.minWeight : `${rollType.minWeight}–${rollType.maxWeight}`;
  }

  sortByColorThicknessRollId(rollsInfo: RollInfo[]): RollInfo[] {
    return rollsInfo.sort((a, b) => {
      const colorSortValue = compareColors(a.rollType.colorCode, b.rollType.colorCode);
      const thicknessSort = a.rollType.thickness - b.rollType.thickness;
      return colorSortValue != 0 ? colorSortValue :
        thicknessSort != 0 ? thicknessSort : a.rollType.id - b.rollType.id;
    });
  }

  openAddRollTypeModal() {
    const operation = (result: Promise < RollType > ) => {
      result
        .then((resolve: RollType) => {
          this.rollsService.postRollType(resolve, this.daysInTable, this.restDate, this.toDate)
            .subscribe(rollInfo => {
              this.rollsInfo.push(rollInfo);
            }, error => this.openHttpErrorModal(error));
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
            }, error => this.openHttpErrorModal(error))
        }, reject => {});
    };
    const modalOptions: Partial < IModalDialogOptions < RollTypeModalData >> = {
      title: 'Редактирование рулона',
      childComponent: RollTypeModalComponent,
      data: {
        rollType: rollType,
        operation: operation.bind(this)
      }
    };
    this.ngxModalService.openDialog(this.viewRef, modalOptions);
  }

  openCreateRollOperationModal(batch: RollBatch, index: number, rollTypeId: number) {
    const operation = (result: Promise < RollOperation > ) => {
      result
        .then((resolve: RollOperation) => {
          this.rollsService.postRollOperation(resolve).subscribe(data => {
            this.fetchTableData();
          }, error => this.openHttpErrorModal(error));
        }, reject => {});
    }

    const modalOptions: Partial < IModalDialogOptions < RollOperationModalData >> = {
      title: 'Операция над рулонами',
      childComponent: RollOperationModalComponent,
      data: {
        batch,
        rollTypeId,
        manufacturedDate: this.daysHeader[index],
        operation: operation.bind(this)
      }
    };
    this.ngxModalService.openDialog(this.viewRef, modalOptions);
  }

  isReady(batch: RollBatch) {
    if (!batch) return false;
    return getDifferenceInDays(new Date(), getDate(batch.dateManufactured)) >= this.DAYS_TO_READY;
  }

  openHttpErrorModal(messages: string[]) {
    const modalOptions: Partial < IModalDialogOptions < string[] >> = {
      title: 'Ошибка',
      childComponent: HttpErrorModalComponent,
      data: messages
    };
    this.ngxModalService.openDialog(this.viewRef, modalOptions)
  }

  onChangeRollCheck(rollCheck: RollCheck) {
    this.rollChecks.set(rollCheck.id, rollCheck);
  }

  submitRollChecks() {
    this.rollsService.putRollChecks(Array.from(this.rollChecks.values()))
      .subscribe(data => {
        if (data.length != 0) {
          this.fetchTableData();
          this.rollChecks.clear();
        }
      }, error => this.openHttpErrorModal(error));
  }

  showMessage(value) {
    console.log(value);
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
}
