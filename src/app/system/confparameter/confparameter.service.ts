import {Injectable} from '@angular/core';
import {SERVER_API_URL} from '../../app.constants';
import {Observable} from 'rxjs/Observable';
import {ConfparameterDto} from './confparameter-dto';
import {HttpClient, HttpResponse} from '@angular/common/http';

@Injectable()
export class ConfparameterService {
    constructor(
        private http: HttpClient
    ) {

    }

    edit(confdto: ConfparameterDto): Observable<HttpResponse<ConfparameterDto>> {
        return this.http.put<ConfparameterDto>(SERVER_API_URL + 'systemoperation/api/updateConfParameter', confdto, {observe: 'response'});
    }

    getOne(id): Observable<HttpResponse<ConfparameterDto>> {
        return this.http.get<ConfparameterDto>(SERVER_API_URL + 'systemoperation/api/conf-parameters/' + id, {observe: 'response'});
    }

}