import { Injectable } from "@angular/core";
import { Observable } from "../../../../../node_modules/rxjs";

import { AuthenticationService } from "./authentication.service";
import { Role } from "../enums/role.enum";

@Injectable()
export class AuthorizationService {

    constructor(
        private authService: AuthenticationService
    ) { }

    checkAuthorization(roles: string[]): Observable<boolean> {
        let isAuthorized = false;
        const currentUser = this.authService.getCurrentUser();
        if (currentUser !== null) {
            roles.forEach(role => {
                if (currentUser.roles.indexOf(Role[role]) > -1) {
                    isAuthorized = true;
                }
            })
        }
        return Observable.of(isAuthorized);
    }

}
