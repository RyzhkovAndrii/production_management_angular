import { Component, OnInit, Input, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ModalDialogService, IModalDialogOptions } from 'ngx-modal-dialog';

import { Client } from '../../../models/client.model';
import { ClientsService } from '../../../services/client.service';
import { AppModalService } from '../../../../app-shared/services/app-modal.service';
import { TextConfirmModalComponent } from '../../../../app-shared/components/text-confirm-modal/text-confirm-modal.component';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {

  readonly NAME_MAX_LENGTH = 50;

  @Input()
  clientList: Client[];

  @Output() onCancel = new EventEmitter<any>();
  @Output() onClientListChange = new EventEmitter<any>();

  private _id: number = null;
  private editElementIndex: number;

  private isChanged = false;

  form: FormGroup;

  constructor(
    private clientService: ClientsService,
    private viewRef: ViewContainerRef,
    private ngxModalDialogService: ModalDialogService,
    private appModalService: AppModalService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      "name": new FormControl(null, [Validators.required, Validators.maxLength(this.NAME_MAX_LENGTH), this.uniqueNameValidator.bind(this)])
    });
  }

  cancel() {
    this.onCancel.emit();
    if (this.isChanged) {
      this.onClientListChange.emit();
    }
  }

  isEditOperation() {
    return this._id !== null;
  }

  saveClient() {
    const { name } = this.form.value;
    const client = new Client(name);
    this.clientService
      .save(client)
      .subscribe(
        data => {
          this.clientList.push(data);
          this.isChanged = true;
          this.cleanForm();
        },
        error => this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error)
      );
  }

  editClient() {
    const { name } = this.form.value;
    const client = new Client(name);
    this.clientService
      .update(client, this._id)
      .subscribe(
        data => {
          this.clientList[this.editElementIndex] = data;
          this.isChanged = true;
          this.cleanForm();
        },
        error => this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error)
      );
  }

  prepareToEdit(i: number) {
    this._id = this.clientList[i].id;
    this.editElementIndex = i;
    this.form.get("name").setValue(this.clientList[i].name);
    this.form.get("name").markAsTouched();
  }

  editCancel() {
    this._id = null;
    this.cleanForm();
  }

  uniqueNameValidator(control: AbstractControl) {
    const name = control.value;
    for (let i = 0; i < this.clientList.length; i++) {
      const client = this.clientList[i];
      if ((String(name).toUpperCase() === String(client.name).toUpperCase()) && (this._id !== client.id)) {
        return { 'uniqueName': true }
      }
    }
    return null;
  }

  openClientDelConfirm(i: number) {
    const modalOptions = {
      title: 'Подтвердите удаление Клиента',
      childComponent: TextConfirmModalComponent,
      data: "Удаление Клиента приведет к удалению всех его действующих и выполненных заказов!",
      actionButtons: [
        {
          text: 'Отменить',
          buttonClass: 'btn btn-outline-dark',
          onAction: () => true
        },
        {
          text: 'Удалить',
          buttonClass: 'btn btn-danger',
          onAction: () => {
            this.deleteClient(i);
            return true;
          }
        }
      ]
    };
    this.ngxModalDialogService.openDialog(this.viewRef, modalOptions);
  }

  private deleteClient(i: number) {
    const id = this.clientList[i].id;
    this.clientService
      .delete(id)
      .subscribe(
        () => {
          this.clientList.splice(i, 1);
          this.isChanged = true;
          this.cleanForm();
        },
        error => this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error)
      );
  }

  private cleanForm() {
    this.form.reset();
    this._id = null;
  }

}
