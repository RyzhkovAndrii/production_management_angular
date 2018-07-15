import { Injectable } from "@angular/core";
import { User } from "../models/user.model";

@Injectable()
export class AuthenticationService {

    constructor() { }

    login(username: string, password: string) {
        const currentUser = new User(username, password, 'testFirstName');
        localStorage.setItem('user', JSON.stringify(currentUser));
    }

    logout() {
        localStorage.removeItem('user');
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }

    // constructor(private http: HttpClient) { }
 
    // login(username: string, password: string) {
    //     return this.http.post<any>('/api/authenticate', { username: username, password: password })
    //         .map(user => {
    //             // login successful if there's a jwt token in the response
    //             if (user && user.token) {
    //                 // store user details and jwt token in local storage to keep user logged in between page refreshes
    //                 localStorage.setItem('currentUser', JSON.stringify(user));
    //             }
 
    //             return user;
    //         });
    // }
 
    // logout() {
    //     // remove user from local storage to log user out
    //     localStorage.removeItem('currentUser');
    // }

}