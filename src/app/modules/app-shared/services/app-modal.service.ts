import { Injectable, ViewContainerRef, ApplicationRef } from '@angular/core';
import { IModalDialogOptions, ModalDialogService, IModalDialogButton } from 'ngx-modal-dialog';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

import { HttpErrorModalComponent } from '../components/http-error-modal/http-error-modal.component';
import { httpErrorHandle } from '../../../app-utils/app-http-error-handler';
import { SimpleConfirmModalComponent } from '../components/simple-confirm-modal/simple-confirm-modal.component';
import { TextConfirmModalComponent } from '../components/text-confirm-modal/text-confirm-modal.component';

@Injectable()
export class AppModalService {

  constructor(
    private applicationRef: ApplicationRef,
    private ngxModalDialogService: ModalDialogService,
  ) { }

  openHttpErrorModal(ngxModalService: ModalDialogService, viewRef: ViewContainerRef, messages: string[]) {
    const modalOptions: Partial<IModalDialogOptions<string[]>> = {
      title: 'Ошибка',
      childComponent: HttpErrorModalComponent,
      data: messages
    };
    ngxModalService.openDialog(viewRef, modalOptions);
  }

  openHttpError(error: any): ErrorObservable {
    const handle = httpErrorHandle(error);
    const message = handle ? handle.error : error;
    this.openHttpErrorModal(this.ngxModalDialogService, this.getRootViewContainerRef(), message);
    return Observable.throw(message);
  }

  openDeletConfirm(title: string, func: Function, message?: string) {
    const cancel = {
      text: 'Отменить',
      buttonClass: 'btn btn-outline-dark',
      onAction: () => true
    };
    const confirm = {
      text: 'Удалить',
      buttonClass: 'btn btn-danger',
      onAction: () => {
        func.call(this);
        return true;
      }
    };
    const buttons = [cancel, confirm];
    this.openModal(title, buttons, message);
  }

  openInformation(title: string, message?: string) {
    const confirm = {
      text: 'OK',
      buttonClass: 'btn btn-outline-dark',
      onAction: () => true
    };
    const buttons = [confirm];
    this.openModal(title, buttons, message);
  }

  private openModal(title: string, buttons: IModalDialogButton[], message?: string) {
    const component = message ? TextConfirmModalComponent : SimpleConfirmModalComponent;
    const options = {
      title: title,
      childComponent: component,
      actionButtons: buttons,
      data: message
    };
    this.ngxModalDialogService.openDialog(this.getRootViewContainerRef(), options);
  }

  private getRootViewContainerRef(): ViewContainerRef {
    const appInstance = this.applicationRef.components[0].instance;
    if (!appInstance.viewContainerRef) {
      const appName = this.applicationRef.componentTypes[0].name;
      throw new Error(`Missing 'viewContainerRef' declaration in ${appName} constructor`);
    }
    return appInstance.viewContainerRef;
  }

}
