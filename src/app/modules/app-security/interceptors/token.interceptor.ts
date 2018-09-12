import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';
import { SecurityModuleUrlService } from '../services/security-module-url.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    private isRefreshing = false;
    private accessTokenSource = new BehaviorSubject<string>(null);
    private accessToken$ = this.accessTokenSource.asObservable();

    constructor(
        private authService: AuthenticationService,
        private securityUrlService: SecurityModuleUrlService,
        private router: Router,
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.isUrlPermitAll(request.url)) {
            return next.handle(request);
        }
        if (!this.isAccessTokenExpired()) {
            return next.handle(this.addToken(request, this.authService.getAccessToken()));
        } else {
            if (!this.isRefreshing) {
                this.isRefreshing = true;
                this.accessTokenSource.next(null);
                return this.authService.refreshToken()
                    .flatMap(token => {
                        this.authService.setToken(token);
                        this.accessTokenSource.next(token.accessToken);
                        return next.handle(this.addToken(request, token.accessToken));
                    })
                    .catch((err) => {
                        if (err.status === 401) {
                            this.authService.logout();
                            this.router.navigate(['/auth/login'], { queryParams: { authError: true } });
                            return Observable.of();
                        }
                        return Observable.throw(err);
                    })
                    .finally(() => this.isRefreshing = false);
            } else {
                return this.accessToken$
                    .filter(token => token !== null)
                    .take(1)
                    .flatMap(token => next.handle(this.addToken(request, token)));
            }
        }
    }

    addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    private isUrlPermitAll(url: string): boolean {
        const loginUrl = this.securityUrlService.loginUrl;
        const refreshUrl = this.securityUrlService.refreshUrl;
        return (url.search(loginUrl) !== -1) || (url.search(refreshUrl) !== -1);
    }

    private isAccessTokenExpired() {
        return this.authService.isTokenExpired(this.authService.getAccessToken());
    }

}
