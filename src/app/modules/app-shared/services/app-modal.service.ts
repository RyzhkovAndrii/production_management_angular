import {
  Injectable,
  ViewContainerRef
} from '@angular/core';
import {
  IModalDialogOptions,
  ModalDialogService
} from 'ngx-modal-dialog';
import {
  HttpErrorModalComponent
} from '../components/http-error-modal/http-error-modal.component';

@Injectable()
export class AppModalService {

  constructor() {}

  openHttpErrorModal(ngxModalService: ModalDialogService, viewRef: ViewContainerRef, messages: string[]) {
    const modalOptions: Partial < IModalDialogOptions < string[] >> = {
      title: 'Ошибка',
      childComponent: HttpErrorModalComponent,
      data: messages
    };
    ngxModalService.openDialog(viewRef, modalOptions)
  }
}
