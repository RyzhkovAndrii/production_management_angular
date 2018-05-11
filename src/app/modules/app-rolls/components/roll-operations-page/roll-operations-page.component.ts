import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {
  ActivatedRoute,
  Params,
  Router
} from '@angular/router';
import {
  FormGroup,
  FormControl
} from '@angular/forms';
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
import {
  formatDateServerToBrowser,
  formatDateBrowserToServer
} from '../../../../app-utils/app-date-utils';

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

  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rollsService: RollsService,
    private ngxModalService: ModalDialogService,
    private viewRef: ViewContainerRef,
    private appModalService: AppModalService) {
    this.queryParams = Object.assign({}, this.route.snapshot.queryParams);
    this.rollTypeId = this.queryParams['roll_type_id'];
  }

  ngOnInit() {
    this.fetchData();
    this.form = new FormGroup({
      fromDate: new FormControl(formatDateServerToBrowser(this.fromDateValue)),
      toDate: new FormControl(formatDateServerToBrowser(this.toDateValue))
    })
  }
  private fetchData() {
    this.fromDateValue = this.queryParams['from'];
    this.toDateValue = this.queryParams['to'];
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

  onSubmit() {
    console.log(this.form);
    this.queryParams['from'] = formatDateBrowserToServer(this.form.value.fromDate);
    this.queryParams['to'] = formatDateBrowserToServer(this.form.value.toDate);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.queryParams
    });
    this.fetchData()
  }
}
