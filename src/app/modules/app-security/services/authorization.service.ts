import { Injectable } from "@angular/core";
import { Observable } from "../../../../../node_modules/rxjs";

@Injectable()
export class AuthorizationService {

    constructor() { }

    checkAuthorization(roleList: string[]): Observable<boolean> {
        return Observable.of(false);
    }

    checkBooleanAuthorization(isAuthorized: boolean): Observable<boolean> { // todo for tests
        return Observable.of(isAuthorized);
    }

}