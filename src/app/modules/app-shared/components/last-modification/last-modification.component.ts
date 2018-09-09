import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';
import { ModalDialogService } from '../../../../../../node_modules/ngx-modal-dialog';
import * as moment from 'moment';

import { Modififcation } from '../../models/modification.model';
import { ModificationService } from '../../services/modification.service';
import { AppModalService } from '../../../app-shared/services/app-modal.service';
import { TableType } from '../../enums/table-type.enum';
import { User } from '../../../app-users/models/user.model';
import { UserService } from '../../../app-users/services/user.service';

@Component({
  selector: 'app-last-modification',
  templateUrl: './last-modification.component.html',
  styleUrls: ['./last-modification.component.css']
})
export class LastModificationComponent implements OnInit {

  @Input() tableType: TableType;

  lastModification: Modififcation;
  lastUser: User;

  constructor(
    private modificationService: ModificationService,
    private userService: UserService,
    private viewRef: ViewContainerRef,
    private ngxModalDialogService: ModalDialogService,
    private appModalService: AppModalService
  ) { }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.modificationService
      .get(this.tableType)
      .subscribe(
        response => {
          this.lastModification = response;
          this.lastModification.modificationDateTime = this.formatDateTime(this.lastModification.modificationDateTime);
          this.userService
            .get(response.userId)
            .subscribe(
              user => this.lastUser = user,
              error => this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error)
            );
        },
        error => this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error)
      );
  }

  reload() {
    this.fetchData();
  }

  private formatDateTime(dateTime: string) {
    const modificationDate: moment.Moment = moment(dateTime, 'DD-MM-YYYY HH:mm:ss');
    if (moment().diff(modificationDate, 'days') === 0) {
      return modificationDate.format('сегодня в HH:mm').toString();
    }
    if (moment().diff(modificationDate, 'days') === 1) {
      return modificationDate.format('вчера в HH:mm').toString();
    }
    return modificationDate.format('DD.MM.YYYY в HH:mm').toString();
  }

}
