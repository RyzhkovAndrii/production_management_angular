import {
  Component,
  OnInit
} from '@angular/core';
import {
  substructDays,
  midnightDate,
  addDays,
  formatDate,
  getIndex
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
  AddRollTypeModalComponent
} from './add-roll-type-modal/add-roll-type-modal.component';
import { RollOperationModalComponent } from './roll-operation-modal/roll-operation-modal.component';

@Component({
  selector: 'app-rolls-page',
  templateUrl: './rolls-page.component.html',
  styleUrls: ['./rolls-page.component.css']
})
export class RollsPageComponent implements OnInit {
  dateHeader: Date[] = [];
  rollsInfo: RollInfo[] = [];
  daysInTable = 30;
  restDate = substructDays(midnightDate(), this.daysInTable + 1);
  toDate = midnightDate();

  constructor(private rollsService: RollsService, private modalService: NgbModal) {}

  ngOnInit() {
    this.initTableHeader();
    this.fetchTableData();
  }

  private fetchTableData() {
    this.rollsService.getRollsInfo(this.restDate, this.toDate)
      .subscribe(data => {
        this.rollsInfo = data;
      });
  }

  private initTableHeader() {
    const date = substructDays(midnightDate(), this.daysInTable);
    for (let i = 1; i <= this.daysInTable; i++) {
      const substructedDate = addDays(date, i);
      this.dateHeader.push(substructedDate);
    }
  }

  getBatch(rollBatch: RollBatch): number | string {
    if (rollBatch) return rollBatch.leftAmount;
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
    const modalRef = this.modalService.open(AddRollTypeModalComponent);
    modalRef.result
      .then(data => {
        this.rollsService.postRollType(data, this.daysInTable, this.restDate, this.toDate)
          .subscribe(rollInfo => {
            this.rollsInfo.push(rollInfo);
          });
      }, reason => {});
  }

  openCreateRollOperationModal(batch: RollBatch, index: number, rollTypeId: number) {
    const date = this.dateHeader[index];
    const modalRef = this.modalService.open(RollOperationModalComponent);
    modalRef.componentInstance.batch = batch;
    modalRef.componentInstance.manufacturedDate = date;
    modalRef.componentInstance.rollTypeId = rollTypeId;
    modalRef.result
      .then(data => {
        console.log(data);
        this.fetchTableData();
      }, reason => {});
  }
}
