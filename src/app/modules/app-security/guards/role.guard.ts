
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "../../../../../node_modules/rxjs";
import { AuthorizationService } from "../services/authorization.service";

@Injectable()
export class RoleGuard implements CanActivate {

    constructor(
        private router: Router,
        private authService: AuthorizationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        let canActivate = false;
        let roles = route.data['roles'] as Array<string>;
        this.authService
            .checkAuthorization(roles)
            .subscribe(authorized => canActivate = authorized);
        if (canActivate) {
            return true;
        }
        this.router.navigate(['/access-denied']);
        return false;
    }



}