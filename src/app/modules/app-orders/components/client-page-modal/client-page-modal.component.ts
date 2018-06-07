import { Component, OnInit, ComponentRef, ViewContainerRef } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { IModalDialog, IModalDialogOptions, IModalDialogButton, ModalDialogService } from 'ngx-modal-dialog';

import { Client } from '../../models/client.model';
import { ClientsService } from '../../services/client.service';
import { SimpleConfirmModalComponent } from '../../../app-shared/components/simple-confirm-modal/simple-confirm-modal.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-client-page-modal',
  templateUrl: './client-page-modal.component.html',
  styleUrls: ['./client-page-modal.component.css']
})
export class ClientPageModalComponent implements IModalDialog {

  actionButtons: IModalDialogButton[];

  clientList: Client[];

  form: FormGroup;

  private _id: number = null;
  private updateElementIndex: number;

  private subscription: Subscription;

  constructor(
    private clientService: ClientsService,
    private ngxModalService: ModalDialogService,
    private viewRef: ViewContainerRef
  ) {
    this.actionButtons = [
      {
        text: "Выход",
        buttonClass: "btn btn-outline-dark",
        onAction: () => {
          if (this.subscription) {
            this.subscription.unsubscribe();
          }
          return true;
        }
      }
    ]
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.clientList = options.data.clientList;
    this.form = new FormGroup({
      "name": new FormControl(null, [Validators.required, this.uniqueNameValidator.bind(this)]),
    });
  }

  isEditOperation() {
    return this._id !== null;
  }

  saveOrUpdateClient() {
    const { name } = this.form.value;
    const client = new Client(name);
    if (this._id === null) {
      this.subscription = this.clientService.save(client)
        .subscribe(data => this.clientList.push(data));
    } else {
      this.subscription = this.clientService.update(client, this._id)
        .subscribe(data => this.clientList[this.updateElementIndex] = data);
      this.cleanForm();
    }
  }

  deleteClient(i: number) {
    const id = this.clientList[i].id;
    this.clientService.delete(id).subscribe();
    this.clientList.splice(i, 1);
    this.cleanForm();
  }

  prepareToEdit(i: number) {
    this._id = this.clientList[i].id;
    this.form.get("name").setValue(this.clientList[i].name);
    this.updateElementIndex = i;
    this.form.get("name").markAsTouched();
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

  private cleanForm() {
    this.form.reset();
    this._id = null;
  }

  // openDeleteConfirm(i: number) {
  //   console.log("open delete dialog");
  //   const modalOptions: Partial<IModalDialogOptions<any>> = {
  //     title: 'Подтвердите удаление клиента',
  //     childComponent: SimpleConfirmModalComponent,
  //     actionButtons: [{
  //       text: 'Отменить',
  //       buttonClass: "btn btn-outline-dark",
  //       onAction: () => true
  //     },
  //     {
  //       text: 'Удалить',
  //       buttonClass: "btn btn-outline-dark",
  //       onAction: () => {
  //         this.deleteClient(i);
  //         return true;
  //       }
  //     }]
  //   };
  //   this.ngxModalService.openDialog(this.viewRef, modalOptions);
  // }

}
