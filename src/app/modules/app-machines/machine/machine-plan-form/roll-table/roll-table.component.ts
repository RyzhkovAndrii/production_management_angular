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

  @Output() change = new EventEmitter<number>();

  standard$: Observable<Standard>;
  rollTypes$: Observable<RollType[]>;
  operations$: Observable<ProductPlanOperationResponse[]>;
  tableData$: Observable<TableData[]>;

  standard: Standard;

  constructor(
    private dataService: MachineModuleStoreDataService,
    private casheService: MachineModuleCasheService,
    private productPlanService: ProductsPlanService
  ) { }

  ngOnInit() {
    // todo remove null check form all observable methods
    this.standard$ = this.getStandard(this.productType$);
    this.rollTypes$ = this.getRollTypes(this.standard$);
    this.operations$ = this.getOperations(this.productType$).do(operations => this.setInitAmount(operations));
    this.tableData$ = this.getTableData();
    this.standard$.subscribe(s => this.standard = s);
  }

  onChange() {
    // todo too much calculations
    let rollAmount = 0;
    this.rollAmounts.forEach(elem => {
      let amount = Number.parseInt(elem.nativeElement.value);
      amount = amount > 0 ? Math.round(amount) : 0;
      elem.nativeElement.value = amount;
      rollAmount += amount;
    });
    const productAmount = rollAmount * this.standard.norm;
    this.change.emit(productAmount);
  }

  private setInitAmount(operations: ProductPlanOperationResponse[]) {
    let rollAmount = 0;
    operations.forEach(operation => rollAmount += (operation.rollAmount - operation.rollToMachinePlane));
    const productAmount = rollAmount * this.standard.norm;
    this.change.emit(productAmount);
  }

  private getStandard(type$: Observable<ProductTypeResponse>): Observable<Standard> {
    return type$.flatMap(type => {
      return !type
        ? Observable.of()
        : this.dataService.getStandards()
          .map(standards => {
            return standards.find(standard => standard.productTypeId === type.id);
          });
    });
  }

  private getRollTypes(standard$: Observable<Standard>): Observable<RollType[]> {
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
      .flatMap(data => {
        if (!data[1]) {
          return Observable.of();
        }
        return this.productPlanService
          .getOperationsByProduct(
            data[1].id,
            formatDateBrowserToServer(data[0]),
            formatDateBrowserToServer(data[0])
          );
      });
  }

  private getTableData(): Observable<TableData[]> {
    return Observable.combineLatest(
      this.rollTypes$,
      this.operations$,
      (rolls, operations) => {
        if (!rolls) {
          return null;
        }
        return rolls.length !== 0
          ? rolls.map(roll => this.getTableRow(roll, operations))
          : [];
      });
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
