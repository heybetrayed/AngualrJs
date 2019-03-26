import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../app.constants';
import {HttpClient, HttpResponse} from '@angular/common/http';


@Injectable()
export class ItrlMemAuthenticationService {

    constructor(
        private http: HttpClient
    ) {

    }

    itrlMemAuthentication(memberNo: string): Observable<HttpResponse<any>> {
        return this.http.get(SERVER_API_URL + 'integralapp/api/itrlMemAuthentication/' + memberNo, {observe: 'response'});
    }

}
