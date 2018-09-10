import { Injectable, ViewContainerRef, ApplicationRef } from '@angular/core';
import { IModalDialogOptions, ModalDialogService } from 'ngx-modal-dialog';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

import { HttpErrorModalComponent } from '../components/http-error-modal/http-error-modal.component';
import { httpErrorHandle } from '../../../app-utils/app-http-error-handler';

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

  openHttpErrorWindow(error: any): ErrorObservable {
    const handle = httpErrorHandle(error);
    const message = handle ? handle.error : error;
    this.openHttpErrorModal(this.ngxModalDialogService, this.getRootViewContainerRef(), message);
    return Observable.throw(message);
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
