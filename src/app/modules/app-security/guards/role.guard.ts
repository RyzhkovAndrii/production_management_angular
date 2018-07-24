
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "../../../../../node_modules/rxjs";
import { AuthorizationService } from "../services/authorization.service";

@Injectable()
export class RoleGuard implements CanActivate, CanActivateChild {

    constructor(
        private router: Router,
        private authService: AuthorizationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        let canActivate = false;
        let roles: string[] = [];
        if (route.data['roles']) {
            roles = route.data['roles'];
        }
        this.authService
            .checkAuthorization(roles)
            .subscribe(authorized => canActivate = authorized);
        if (canActivate) {
            return true;
        }
        this.router.navigate(['/auth/access-denied']);
        return false;
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        return this.canActivate(childRoute, state);
    }



}