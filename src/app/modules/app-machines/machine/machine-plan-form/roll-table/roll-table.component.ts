import { Component, OnInit, Input, ViewChildren, QueryList, ElementRef, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { MachineModuleStoreDataService } from '../../../services/machine-module-store-data.service';
import { MachineModuleCasheService } from '../../../services/machine-module-cashe.service';
import { ProductsPlanService } from '../../../../app-products-plan/services/products-plan.service';
import { formatDateBrowserToServer } from '../../../../../app-utils/app-date-utils';

interface TableData {
  roll: RollType;
  operation: ProductPlanOperationResponse;
}

@Component({
  selector: 'app-roll-table',
  templateUrl: './roll-table.component.html',
  styleUrls: ['./roll-table.component.css']
})
export class RollTableComponent implements OnInit {

  @ViewChildren('rollAmount') rollAmounts: QueryList<ElementRef>;

  @Input() productType$: Observable<ProductTypeResponse>;

  @Output() changeData: EventEmitter<number> = new EventEmitter<number>();

  standard$: Observable<Standard>;
  tableData$: Observable<TableData[]>;

  standard: Standard;

  constructor(
    private dataService: MachineModuleStoreDataService,
    private casheService: MachineModuleCasheService,
    private productPlanService: ProductsPlanService
  ) { }

  ngOnInit() {
    this.standard$ = this.getStandard(this.productType$);
    this.tableData$ = this.getTableData(this.productType$);
    this.standard$.subscribe(s => this.standard = s);
  }

  onChange() {
    // todo remove too much calculations
    let rollAmount = 0;
    this.rollAmounts.forEach(elem => {
      let amount = Number.parseInt(elem.nativeElement.value);
      amount = amount > 0 ? Math.round(amount) : 0;
      elem.nativeElement.value = amount;
      rollAmount += amount;
    });
    const productAmount = rollAmount * this.standard.norm;
    this.changeData.emit(productAmount);
  }

  getDiffAmount(operation: ProductPlanOperationResponse): number {
    const amount = operation.rollAmount - operation.rollToMachinePlane;
    return amount > 0 ? amount : 0;
  }

  private setInitAmount(operations: ProductPlanOperationResponse[]) {
    let rollAmount = 0;
    operations.forEach(operation => rollAmount += this.getDiffAmount(operation));
    const productAmount = rollAmount * this.standard.norm;
    this.changeData.emit(productAmount);
  }

  private getStandard(type$: Observable<ProductTypeResponse>): Observable<Standard> {
    return type$.flatMap(type => {
      const standard$ = this.dataService
        .getStandards()
        .map(standards =>
          standards.find(standard =>
            standard.productTypeId === type.id));
      return type ? standard$ : Observable.empty();
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
        this.getOperations(type$).do(operations => this.setInitAmount(operations)),
        (rolls, operations) => rolls.length !== 0 ? rolls.map(roll => this.getTableRow(roll, operations)) : []
      );
    return type$.switchMap(type => type ? data$ : Observable.empty());
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
