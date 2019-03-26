import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import {SERVER_API_URL} from "../../app.constants";
import {HttpClient, HttpResponse} from '@angular/common/http';

@Injectable()
export class AccountService  {
    constructor(private http: HttpClient) { }

    get(): Observable<HttpResponse<Account>> {
        return this.http.get<Account>(SERVER_API_URL + 'uaa/api/account', { observe: 'response' });
    }

    save(account: any): Observable<any> {
        return this.http.post(SERVER_API_URL + 'uaa/api/account', account);
    }
}
