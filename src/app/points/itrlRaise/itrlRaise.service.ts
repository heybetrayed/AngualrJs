import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../app.constants';
import {RaiseItrlDTO} from './itrlRaise-dto';
import {HttpClient, HttpResponse} from '@angular/common/http';


@Injectable()
export class ItrlRaiseService {

    constructor(
        private http: HttpClient
    ) {

    }

    getItrlRaise(raiseItrlDTO: RaiseItrlDTO): Observable<HttpResponse<RaiseItrlDTO>> {
        return this.http.post<RaiseItrlDTO>(SERVER_API_URL + 'integralapp/api/saveItrlRaise', raiseItrlDTO, {observe: 'response'});
    }

}
