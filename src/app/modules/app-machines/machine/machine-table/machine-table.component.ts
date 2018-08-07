import { Component, OnInit, Input, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { ModalDialogService } from '../../../../../../node_modules/ngx-modal-dialog';
import * as moment from 'moment';

import { MachinePlanItem } from '../../models/machine-plan-item.model';
import { MachineService } from '../../services/machine.service';
import { AppModalService } from '../../../app-shared/services/app-modal.service';

@Component({
  selector: 'app-machine-table',
  templateUrl: './machine-table.component.html',
  styleUrls: ['./machine-table.component.css']
})
export class MachineTableComponent implements OnInit {

  @Input() machinePlan: MachinePlanItem[];
  @Input() standards: Standard[];

  @Output() onPlanItemRemove = new EventEmitter<MachinePlanItem>();

  tableMachinePlan: { planItem: MachinePlanItem, standard: Standard }[] = [];

  constructor(
    private machineService: MachineService,
    private viewRef: ViewContainerRef,
    private ngxModalDialogService: ModalDialogService,
    private appModalService: AppModalService
  ) { }

  ngOnInit() {
    this.createComponentData();
  }

  removePlanItem(i: number) {
    this.machineService
      .delete(this.machinePlan[i].id)
      .subscribe(
        () => {
          this.machinePlan.splice(i, 1);
          this.tableMachinePlan.splice(i, 1);
          this.onPlanItemRemove.emit();
        },
        error => this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error)
      )
  }

  getFinishTime(planItem: MachinePlanItem) {
    const format = 'DD-MM-YYYY HH:mm:SS';
    const time = moment(planItem.timeStart, format);
    time.add(planItem.duration, 'hours');
    return time.toDate();
  }

  private createComponentData() {
    this.machinePlan.forEach(planItem =>
      this.tableMachinePlan.push(
        {
          planItem: planItem,
          standard: this.getStandard(planItem)
        }
      )
    )
  }

  private getStandard(machinePlan: MachinePlanItem) {
    return this.standards.find(standard => standard.productTypeId === machinePlan.productTypeId);
  }

}
