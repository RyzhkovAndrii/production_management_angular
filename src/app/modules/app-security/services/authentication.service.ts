import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as jwt_decode from 'jwt-decode';

import { User } from "../models/user.model";
import { SecurityModuleUrlService } from "./security-module-url.service";
import { Observable } from "../../../../../node_modules/rxjs";
import { httpErrorHandle } from "../../../app-utils/app-http-error-handler";

@Injectable()
export class AuthenticationService {

    constructor(
        private http: HttpClient,
        private urlService: SecurityModuleUrlService
    ) { }

    readonly TOKEN_NAME = 'jwt_token';
    readonly USER_NAME = 'user';

    login(username: string, password: string): Observable<string> {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/x-www-form-urlencoded')
        const body = `username=${username}&password=${password}`;
        return this.http
            .post(this.urlService.loginUrl, body, {
                headers: headers,
                responseType: 'text'
            });
    }

    recieveCurrentUserInfo(): Observable<User> {
        let headers = new HttpHeaders();
        headers = headers.set('Authorization', 'Bearer ' + this.getToken());
        return this.http
            .get(this.urlService.currentUserUrl, { headers: headers })
            .catch(httpErrorHandle);
    }

    logout() {
        localStorage.removeItem(this.TOKEN_NAME);
        localStorage.removeItem(this.USER_NAME);
    }

    getToken(): string {
        return localStorage.getItem(this.TOKEN_NAME);
    }

    setToken(token: string): void {
        localStorage.setItem(this.TOKEN_NAME, token);
    }

    getTokenExpirationDate(token: string): Date {
        const decoded = jwt_decode(token);
        if (decoded.exp === undefined) return null;
        const date = new Date(0);
        date.setUTCSeconds(decoded.exp);
        return date;
    }

    isTokenExpired(token?: string): boolean {
        if (!token) token = this.getToken();
        if (!token) return true;
        const date = this.getTokenExpirationDate(token);
        if (date === undefined) return false;
        return !(date.valueOf() > new Date().valueOf());
    }

    getCurrentUser(): User {
        return JSON.parse(localStorage.getItem(this.USER_NAME));
    }

    setCurrentUser(user: User) {
        localStorage.setItem(this.USER_NAME, JSON.stringify(user));
    }

}
