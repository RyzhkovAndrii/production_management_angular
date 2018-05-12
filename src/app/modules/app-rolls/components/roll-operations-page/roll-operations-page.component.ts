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
  FormControl,
  Validators
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
import { compareDates } from '../../../../app-utils/app-comparators';

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
      fromDate: new FormControl(formatDateServerToBrowser(this.fromDateValue), [Validators.required, this.fromDateSmallerValidator.bind(this)]),
      toDate: new FormControl(formatDateServerToBrowser(this.toDateValue), [Validators.required, this.toDateBiggerValidator.bind(this)])
    });
  }
  private fetchData() {
    this.fromDateValue = this.queryParams['from'];
    this.toDateValue = this.queryParams['to'];
    this.rollsService.getRollOperations(this.rollTypeId, this.fromDateValue, this.toDateValue)
      .subscribe((data: RollOperation[]) => {
        this.rollOperations = data.sort((a, b) => {
          return compareDates(a.manufacturedDate, b.manufacturedDate);
        });
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
      queryParams: this.queryParams,
      replaceUrl: true
    });
    this.fetchData()
  }

  fromDateSmallerValidator(control: FormControl) {
    if (control.value && this.form) {
      if(compareDates(control.value, this.form.get('toDate').value, 'YYYY-MM-DD') > 0) {
        return {
          'biggerThenToDate': true
        };
      }
    }
    return null;
  }
  toDateBiggerValidator(control: FormControl) {
    if (control.value && this.form) {
      if(compareDates(control.value, this.form.get('fromDate').value, 'YYYY-MM-DD') < 0) {
        return {
          'smallerThenFromDate': true
        };
      }
    }
    return null;
  }
}
