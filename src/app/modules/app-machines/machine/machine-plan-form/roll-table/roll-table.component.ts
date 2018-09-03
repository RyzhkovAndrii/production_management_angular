import { Component, OnInit, Input, ViewChildren, QueryList, ElementRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { MachineModuleStoreDataService } from '../../../services/machine-module-store-data.service';
import { MachineModuleCasheService } from '../../../services/machine-module-cashe.service';
import { ProductsPlanService } from '../../../../app-products-plan/services/products-plan.service';
import { formatDateBrowserToServer } from '../../../../../app-utils/app-date-utils';
import { Subject } from 'rxjs/Subject';

interface TableData {
  roll: RollType;
  operation: ProductPlanOperationResponse;
}

interface PlanItem {
  roll: RollType;
  rollAmount: number;
  productAmount: number;
}

@Component({
  selector: 'app-roll-table',
  templateUrl: './roll-table.component.html',
  styleUrls: ['./roll-table.component.css']
})
export class RollTableComponent implements OnInit, OnDestroy {

  @ViewChildren('rollAmount') rollAmountInputs: QueryList<ElementRef>;

  @Input() productType$: Observable<ProductTypeResponse>;

  @Output() changeData: EventEmitter<number> = new EventEmitter<number>();

  tableData$: Observable<TableData[]>;
  private _planItems: PlanItem[] = [];
  private standard$: Observable<Standard>;

  private commonRollAmount = 0;
  standard: Standard; // todo make standard async

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(
    private dataService: MachineModuleStoreDataService,
    private casheService: MachineModuleCasheService,
    private productPlanService: ProductsPlanService
  ) { }

  public get planItems() {
    return this._planItems;
  }

  ngOnInit() {
    this.standard$ = this.getStandard(this.productType$);
    this.tableData$ = this.getTableData(this.productType$).do(data => this.setInitAmount(data));
    this.standard$.takeUntil(this.ngUnsubscribe).subscribe(s => this.standard = s);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onChange(i: number) {
    const rollAmountInput = this.rollAmountInputs.toArray()[i];
    let newAmount = Number.parseInt(rollAmountInput.nativeElement.value);
    newAmount = newAmount > 0 ? Math.round(newAmount) : 0;
    rollAmountInput.nativeElement.value = newAmount;
    const oldAmount = this._planItems[i].rollAmount;
    this._planItems[i].rollAmount = newAmount;
    this._planItems[i].productAmount = newAmount * this.standard.norm;
    this.commonRollAmount = this.commonRollAmount - oldAmount + newAmount;
    const productAmount = this.commonRollAmount * this.standard.norm;
    this.changeData.emit(productAmount);
  }

  getDiffAmount(operation: ProductPlanOperationResponse): number {
    const amount = operation.rollAmount - operation.rollToMachinePlane;
    return amount > 0 ? amount : 0;
  }

  private setInitAmount(tableData: TableData[]) {
    this._planItems = [];
    this.commonRollAmount = 0;
    let productAmount = 0;
    if (tableData !== null) {
      tableData.forEach(data => {
        const diffAmount = this.getDiffAmount(data.operation);
        this.commonRollAmount += diffAmount;
        const planItem = { roll: data.roll, rollAmount: diffAmount, productAmount: diffAmount * this.standard.norm };
        this._planItems.push(planItem);
      });
      productAmount = this.commonRollAmount * this.standard.norm;
    }
    this.changeData.emit(productAmount);
  }

  private getStandard(type$: Observable<ProductTypeResponse>): Observable<Standard> {
    return type$.flatMap(type => {
      const standard$ = this.dataService
        .getStandards()
        .map(standards =>
          standards.find(standard =>
            standard.productTypeId === type.id));
      return type ? standard$ : Observable.of(null);
    });
  }

  private getRollTypes(type$: Observable<ProductTypeResponse>): Observable<RollType[]> {
    const standard$ = this.getStandard(type$);
    return standard$.flatMap(standard => {
      return standard.rollTypeIds.length === 0
        ? Observable.of([])
        : Observable.forkJoin(
          standard.rollTypeIds.map(id => this.casheService.getRollType(id))
        );
    });
  }

  private getOperations(type$: Observable<ProductTypeResponse>): Observable<ProductPlanOperationResponse[]> {
    return Observable.combineLatest(this.dataService.getCurrentDate(), type$)
      .flatMap(data => this.productPlanService
        .getOperationsByProduct(
          data[1].id,
          formatDateBrowserToServer(data[0]),
          formatDateBrowserToServer(data[0])
        )
      );
  }

  private getTableData(type$: Observable<ProductTypeResponse>): Observable<TableData[]> {
    const data$ =
      Observable.combineLatest(
        this.getRollTypes(type$),
        this.getOperations(type$),
        (rolls, operations) => rolls.length !== 0 ? rolls.map(roll => this.getTableRow(roll, operations)) : []
      );
    return type$.switchMap(type => type ? data$ : Observable.of(null));
  }

  private getTableRow(roll: RollType, operations: ProductPlanOperationResponse[]): TableData {
    const operation = operations.find(oper => oper.rollTypeId === roll.id);
    const nullOperation = {
      date: null,
      productTypeId: null,
      rollTypeId: roll.id,
      rollAmount: 0,
      productAmount: 0,
      rollToMachinePlane: 0
    };
    return {
      roll: roll,
      operation: operation ? operation : nullOperation
    };
  }

}
