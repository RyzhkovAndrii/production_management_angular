import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { AuthenticationService } from '../services/authentication.service';
import { SecurityModuleUrlService } from '../services/security-module-url.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(
        private authService: AuthenticationService,
        private securityUrlService: SecurityModuleUrlService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.isNotLogginUrl(request.url)) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${this.authService.getAccessToken()}`
                }
            });
        }
        return next.handle(request);
    }

    private isNotLogginUrl(url: string): boolean {
        return url.search(this.securityUrlService.loginUrl) === -1;
    }

}
