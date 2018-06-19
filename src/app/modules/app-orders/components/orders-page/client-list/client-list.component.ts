import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';

import { Client } from '../../../models/client.model';
import { ClientsService } from '../../../services/client.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {

  isClientDelConfirmVisible = false;

  @Input()
  clientList: Client[];

  @Output() onCancel = new EventEmitter<any>();
  @Output() onClientDelete = new EventEmitter<any>();

  private _id: number = null;
  private updateElementIndex: number;
  private currentIndexForDelete;

  form: FormGroup; 

  private subscription: Subscription;

  constructor(private clientService: ClientsService) { }

  ngOnInit() {
    this.form = new FormGroup({
      "name": new FormControl(null, [Validators.required, this.uniqueNameValidator.bind(this)])
    });
  }

  cancel() {
    this.onCancel.emit();
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

  openClientDelConfirm(i: number) {
    this.isClientDelConfirmVisible = true;
    this.currentIndexForDelete = i;
  }

  onClientDelConfirmApply() {
    this.isClientDelConfirmVisible = false;
    this.deleteClient(this.currentIndexForDelete);
    this.onClientDelete.emit();
  }

  onClientDelConfirmCancel() {
    this.isClientDelConfirmVisible = false;
  }

  private deleteClient(i: number) {
    const id = this.clientList[i].id;
    this.clientService.delete(id).subscribe();
    this.clientList.splice(i, 1);
    this.cleanForm();
  }

  private cleanForm() {
    this.form.reset();
    this._id = null;
  }

}
