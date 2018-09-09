import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from '../../../../../node_modules/rxjs';

import { User } from '../models/user.model';
import { httpErrorHandle } from '../../../app-utils/app-http-error-handler';
import { UserModuleUrlService } from './user-module-url.service';

@Injectable()
export class UserService {

    constructor(
        private http: HttpClient,
        private urlService: UserModuleUrlService
    ) { }

    getAll(): Observable<User[]> {
        return this.http.get(this.urlService.userUrl).catch(httpErrorHandle);
    }

    get(id: number): Observable<User> {
        const url = `${this.urlService.userUrl}/${id}`;
        return this.http.get(url).catch(httpErrorHandle);
    }

    save(user: User): Observable<User> {
        return this.http.post(this.urlService.userUrl, user).catch(httpErrorHandle);
    }

    update(user: User, id: number): Observable<User> {
        const url = `${this.urlService.userUrl}/${id}`;
        return this.http.put(url, user).catch(httpErrorHandle);
    }

    delete(id: number) {
        const url = `${this.urlService.userUrl}/${id}`;
        return this.http.delete(url).catch(httpErrorHandle);
    }

}
