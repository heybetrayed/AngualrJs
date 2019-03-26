import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import {SERVER_API_URL} from "../../app.constants";
import {HttpClient} from '@angular/common/http';

@Injectable()
export class AuthServerProvider {
    constructor(
        private http: HttpClient    ) {}

    getToken() {
        return null;
    }

    login(credentials): Observable<any> {
        const data = {
            username: credentials.username,
            password: credentials.password,
            rememberMe: credentials.rememberMe
        };

        return this.http.post(SERVER_API_URL + 'auth/login', data, {});
    }

    loginWithToken(jwt, rememberMe) {
        if (jwt) {
            this.storeAuthenticationToken(jwt, rememberMe);
            return Promise.resolve(jwt);
        } else {
            return Promise.reject('auth-jwt-service Promise reject'); // Put appropriate error message here
        }
    }

    storeAuthenticationToken(jwt, rememberMe) {
    }

    logout(): Observable<any> {
        return this.http.post(SERVER_API_URL + 'auth/logout', null);
    }
}
