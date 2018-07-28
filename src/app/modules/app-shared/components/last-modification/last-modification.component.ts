import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';
import { ModalDialogService } from '../../../../../../node_modules/ngx-modal-dialog';

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
          this.userService
            .get(response.userId)
            .subscribe(
              user => this.lastUser = user,
              error => this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error)
            );
        },
        error => this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error)
      )
  }

  reload() {
    this.fetchData();
  }

}
