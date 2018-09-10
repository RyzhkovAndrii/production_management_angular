import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from '../../../../../node_modules/rxjs';

import { User } from '../models/user.model';
import { UserModuleUrlService } from './user-module-url.service';
import { AppModalService } from '../../app-shared/services/app-modal.service';

@Injectable()
export class UserService {

    constructor(
        private http: HttpClient,
        private urlService: UserModuleUrlService,
        private modalService: AppModalService
    ) { }

    getAll(): Observable<User[]> {
        return this.http
            .get(this.urlService.userUrl)
            .catch(err => this.modalService.openHttpError(err));
    }

    get(id: number): Observable<User> {
        const url = `${this.urlService.userUrl}/${id}`;
        return this.http
            .get(url)
            .catch(err => this.modalService.openHttpError(err));
    }

    save(user: User): Observable<User> {
        return this.http
            .post(this.urlService.userUrl, user)
            .catch(err => this.modalService.openHttpError(err));
    }

    update(user: User, id: number): Observable<User> {
        const url = `${this.urlService.userUrl}/${id}`;
        return this.http
            .put(url, user)
            .catch(err => this.modalService.openHttpError(err));
    }

    delete(id: number) {
        const url = `${this.urlService.userUrl}/${id}`;
        return this.http
            .delete(url)
            .catch(err => this.modalService.openHttpError(err));
    }

}
