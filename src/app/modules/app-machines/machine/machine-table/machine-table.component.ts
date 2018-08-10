import { Component, OnInit, Input, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { ModalDialogService } from 'ngx-modal-dialog';
import * as moment from 'moment';

import { MachinePlan } from '../../models/machine-plan.model';
import { MachinePlanService } from '../../services/machine-plan.service';
import { AppModalService } from '../../../app-shared/services/app-modal.service';

@Component({
  selector: 'app-machine-table',
  templateUrl: './machine-table.component.html',
  styleUrls: ['./machine-table.component.css']
})
export class MachineTableComponent implements OnInit {

  @Input() dailyMachinePlan: MachinePlan[];
  @Input() standards: Standard[];

  @Output() onPlanRemove = new EventEmitter<MachinePlan>();

  tableMachinePlan: { plan: MachinePlan, standard: Standard }[] = [];

  constructor(
    private machinePlanService: MachinePlanService,
    private viewRef: ViewContainerRef,
    private ngxModalDialogService: ModalDialogService,
    private appModalService: AppModalService
  ) { }

  ngOnInit() {
    this.createComponentData();
  }

  removePlan(i: number) {
    this.machinePlanService
      .delete(this.dailyMachinePlan[i].id)
      .subscribe(
        () => {
          this.dailyMachinePlan.splice(i, 1);
          this.tableMachinePlan.splice(i, 1);
          this.onPlanRemove.emit();
        },
        error => this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error)
      )
  }

  getFinishTime(plan: MachinePlan) {
    const format = 'DD-MM-YYYY HH:mm:SS';
    const time = moment(plan.timeStart, format);
    time.add(plan.duration, 'hours');
    return time.toDate();
  }

  private createComponentData() {
    this.dailyMachinePlan.forEach(plan =>
      this.tableMachinePlan.push(
        {
          plan: plan,
          standard: this.getStandard(plan)
        }
      )
    )
  }

  private getStandard(machinePlan: MachinePlan) {
    return this.standards.find(standard => standard.productTypeId === machinePlan.productTypeId);
  }

}
