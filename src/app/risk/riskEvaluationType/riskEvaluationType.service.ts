import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../app.constants';
import {HttpClient, HttpResponse} from '@angular/common/http';

@Injectable()
export class RiskEvaluationTypeService {

    constructor(
        private http: HttpClient
    ) {

    }

    getTypes(data, params): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + '/riskapp/api/aes-types/filter', data, {params: params, observe: 'response'});
    }

    createType(data): Observable<HttpResponse<any>>{
        return this.http.post(SERVER_API_URL + '/riskapp/api/aes-types', data, {observe: 'response'});
    }

    deleteType(id): Observable<HttpResponse<any>> {
        return this.http.delete(SERVER_API_URL + '/riskapp/api/aes-types/' + id, {observe: 'response'});
    }

    enableType(id): Observable<HttpResponse<any>> {
        return this.http.delete(SERVER_API_URL + '/riskapp/api/enableType/' + id, {observe: 'response'});
    }

    editType(data): Observable<HttpResponse<any>> {
        return this.http.put(SERVER_API_URL + '/riskapp/api/aes-types/', data, {observe: 'response'});
    }

    deleteMultiTypes(data): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + '/riskapp/api/aes-types/multiDelete', data, {observe: 'response'});
    }
}
