import { Injectable, ViewContainerRef, ApplicationRef } from '@angular/core';
import { ModalDialogService } from 'ngx-modal-dialog';
import { AppModalService } from './app-modal.service';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Observable } from 'rxjs/Observable';

import { httpErrorHandle } from '../../../app-utils/app-http-error-handler';

@Injectable()
export class AppHttpErrorService {

    constructor(
        private applicationRef: ApplicationRef,
        private ngxModalDialogService: ModalDialogService,
        private appModalService: AppModalService
    ) { }

    openHttpErrorWindow(error: any): ErrorObservable {
        const handle = httpErrorHandle(error);
        const message = handle ? handle.error : error;
        this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.getRootViewContainerRef(), message);
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
