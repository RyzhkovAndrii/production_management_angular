import { Injectable } from "@angular/core";
import { Observable } from "../../../../../node_modules/rxjs";

import { AuthenticationService } from "./authentication.service";
import { Role } from "../enums/role.enum";

@Injectable()
export class AuthorizationService {

    constructor(
        private authService: AuthenticationService
    ) { }

    checkAuthorization(roles: Role[]): Observable<boolean> {
        let isAuthorized = false;
        const currentUser = this.authService.getCurrentUser();
        if (currentUser !== null) {
            currentUser.roles.forEach(role => {
                if (roles.indexOf(role) > -1) {
                    isAuthorized = true;
                }
            })
        }
        return Observable.of(isAuthorized);
    }

}
