import {
  Component,
  OnInit
} from '@angular/core';
import {
  substructDays,
  midnightDate,
  addDays,
  formatDate,
  getIndex,
  getDifferenceInDays,
  getDate
} from '../../app-utils/app-date-utils.module';
import {
  RollsService
} from '../../services/rolls.service';
import {
  compareColors
} from '../../app-utils/app-comparators.module';
import {
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';
import {
  RollTypeModalComponent
} from './roll-type-modal/roll-type-modal.component';
import { RollOperationModalComponent } from './roll-operation-modal/roll-operation-modal.component';
import * as moment from 'moment';

@Component({
  selector: 'app-rolls-page',
  templateUrl: './rolls-page.component.html',
  styleUrls: ['./rolls-page.component.css']
})
export class RollsPageComponent implements OnInit {
  daysHeader: Date[];
  dateHeader: string[];
  monthYearMap: Map<string, number>;
  rollsInfo: RollInfo[] = [];
  daysInTable = 30;
  restDate: Date;
  fromDate: Date;
  toDate = midnightDate();

  private readonly DAYS_TO_READY = 15;

  constructor(private rollsService: RollsService, private modalService: NgbModal) {}

  ngOnInit() {
    this.showCurrentPeriod();
  }

  private fetchTableData() {
    this.rollsService.getRollsInfo(this.restDate, this.fromDate, this.toDate)
      .subscribe(data => {
        this.rollsInfo = data;        
      });
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
      const monthYear: string = moment(substructedDate).format('MMM YY');
      this.monthYearMap.set(monthYear, this.monthYearMap.has(monthYear)? this.monthYearMap.get(monthYear) + 1 : 1);
    }
    this.dateHeader = Array.from(this.monthYearMap.keys());
      
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
    return this.toDate.getTime() < midnightDate().getTime();
  }

  isBeforePreviousPeriod() {
    return this.toDate.getTime() < substructDays(midnightDate(), this.daysInTable).getTime();
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

  sortByColor(rollsInfo: RollInfo[]): RollInfo[] {
    return rollsInfo.sort((a, b) => compareColors(a.rollType.colorCode, b.rollType.colorCode));
  }

  openAddRollTypeModal() {
    const modalRef = this.modalService.open(RollTypeModalComponent);
    modalRef.componentInstance.title = 'Новый рулон';
    modalRef.result
      .then((data: RollType) => {
        this.rollsService.postRollType(data, this.daysInTable, this.restDate, this.toDate)
          .subscribe(rollInfo => {
            this.rollsInfo.push(rollInfo);
          });
      }, reason => {});
  }

  openEditRollTypeModal(rollType: RollType) {
    const modalRef = this.modalService.open(RollTypeModalComponent);
    modalRef.componentInstance.rollType = rollType;
    modalRef.componentInstance.title = 'Редактирование рулона';
    modalRef.result
      .then((data: RollType) => {
        data.id = rollType.id;
        this.rollsService.putRollType(data)
          .subscribe(x => {
            rollType.id = x.id;
            rollType.name = x.name;
            rollType.colorCode = x.colorCode;
            rollType.thickness = x.thickness;
            rollType.weight = x.weight;
          })
      }, reason => {});
  }

  openCreateRollOperationModal (batch: RollBatch, index: number, rollTypeId: number) {
    const date = this.daysHeader[index];
    const modalRef = this.modalService.open(RollOperationModalComponent);
    modalRef.componentInstance.batch = batch;
    modalRef.componentInstance.manufacturedDate = date;
    modalRef.componentInstance.rollTypeId = rollTypeId;
    modalRef.result
      .then((data: RollOperation) => {
        this.rollsService.postRollOperation(data).subscribe(data => {
          console.log(data);
        });
        this.fetchTableData();
      }, reason => {});
  }

  isReady (batch: RollBatch) {
    if(!batch) return false;
    return getDifferenceInDays(new Date(), getDate(batch.dateManufactured)) >= this.DAYS_TO_READY;
  }
}
