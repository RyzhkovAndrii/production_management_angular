import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';

import { User } from '../../app-users/models/user.model';
import { SecurityModuleUrlService } from './security-module-url.service';
import { Observable } from '../../../../../node_modules/rxjs';
import { httpErrorHandle } from '../../../app-utils/app-http-error-handler';

@Injectable()
export class AuthenticationService {

    private storage: Storage = localStorage;

    constructor(
        private http: HttpClient,
        private urlService: SecurityModuleUrlService
    ) { }

    readonly TOKEN_NAME = 'jwt_token';
    readonly USER_NAME = 'user';

    login(username: string, password: string): Observable<string> {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
        const body = `username=${username}&password=${password}`;
        return this.http
            .post(this.urlService.loginUrl, body, {
                headers: headers,
                responseType: 'text'
            })
            .catch(httpErrorHandle);
    }

    recieveCurrentUserInfo(): Observable<User> {
        let headers = new HttpHeaders();
        headers = headers.set('Authorization', 'Bearer ' + this.getToken());
        return this.http
            .get(this.urlService.currentUserUrl, { headers: headers })
            .catch(httpErrorHandle);
    }

    logout() {
        localStorage.clear();
        sessionStorage.clear();
    }

    getToken(): string {
        return this.storage.getItem(this.TOKEN_NAME);
    }

    setToken(token: string): void {
        this.storage.setItem(this.TOKEN_NAME, token);
    }

    getTokenExpirationDate(token: string): Date {
        const decoded = jwt_decode(token);
        if (!decoded.exp) {
            return null;
        }
        const date = new Date(0);
        date.setUTCSeconds(decoded.exp);
        return date;
    }

    isTokenExpired(token: string): boolean {
        if (!token) {
            return true;
        }
        const date = this.getTokenExpirationDate(token);
        return date ? date.valueOf() < new Date().valueOf() : true;
    }

    isAuthenticated(): boolean {
        const token = this.getToken();
        return !this.isTokenExpired(token);
    }

    getCurrentUser(): User {
        return JSON.parse(this.storage.getItem(this.USER_NAME));
    }

    setCurrentUser(user: User) {
        this.storage.setItem(this.USER_NAME, JSON.stringify(user));
    }

    changeCurrentUserPassword(password: string): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
        const body = `password=${password}`;
        return this.http
            .post(this.urlService.changePasswordUrl, body, {
                headers: headers,
                responseType: 'text'
            });
    }

    setStorage(storage: Storage) {
        this.storage = storage;
    }

}
