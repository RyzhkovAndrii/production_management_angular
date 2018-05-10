import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {
  ActivatedRoute,
  Params
} from '@angular/router';
import {
  IModalDialogOptions,
  ModalDialogService
} from 'ngx-modal-dialog';

import {
  RollsService
} from '../../services/rolls.service';
import {
  RollOperationType
} from '../../enums/roll-operation-type.enum';
import {
  HttpErrorModalComponent
} from '../../../app-shared/components/http-error-modal/http-error-modal.component';
import {
  AppModalService
} from '../../../app-shared/services/app-modal.service';

@Component({
  selector: 'app-roll-operations-page',
  templateUrl: './roll-operations-page.component.html',
  styleUrls: ['./roll-operations-page.component.css']
})
export class RollOperationsPageComponent implements OnInit {
  rollOperations: RollOperation[];

  rollTypeId: number;
  fromDateValue: string;
  toDateValue: string;

  queryParams;

  constructor(
    private route: ActivatedRoute,
    private rollsService: RollsService,
    private ngxModalService: ModalDialogService,
    private viewRef: ViewContainerRef,
    private appModalService: AppModalService) {
    this.queryParams = this.route.snapshot.queryParams;
    this.rollTypeId = this.queryParams['roll_type_id'];
    this.fromDateValue = this.queryParams['from'];
    this.toDateValue = this.queryParams['to'];
  }

  ngOnInit() {
    this.rollsService.getRollOperations(this.rollTypeId, this.fromDateValue, this.toDateValue)
      .subscribe((data: RollOperation[]) => {
        this.rollOperations = data;
      }, error => {
        this.rollOperations = undefined;
        this.appModalService.openHttpErrorModal(this.ngxModalService, this.viewRef, error);
      });
  }
  getOperationType(operationType: RollOperationType) {
    return operationType == RollOperationType.USE ? 'Списание' : 'Производство';
  }

  showOperations(): boolean {
    if (!this.rollOperations) return true;
    return this.rollOperations.length != 0;
  }
}
