import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../app.constants';
import {HttpClient, HttpResponse} from '@angular/common/http';

@Injectable()
export class RiskEvaluationFactorService {

    constructor(
        private http: HttpClient
    ) {
    }

    getFactors(params, data): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + '/riskapp/api/aes-factors/filter', data, {params: params, observe: 'response'});
    }

    createFactor(data): Observable<HttpResponse<any>>{
        return this.http.post(SERVER_API_URL + '/riskapp/api/aes-factors', data, {observe: 'response'});
    }

    deleteModule(id): Observable<HttpResponse<any>> {
        return this.http.delete(SERVER_API_URL + '/riskapp/api/aes-factors/' + id, {observe: 'response'});
    }
    enableModule(id): Observable<HttpResponse<any>> {
        return this.http.delete(SERVER_API_URL + '/riskapp/api/enableModule/' + id, {observe: 'response'});
    }

    editModule(data): Observable<HttpResponse<any>> {
        return this.http.put(SERVER_API_URL + '/riskapp/api/aes-factors/', data, {observe: 'response'});
    }

    deleteMultiFactors(data): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + '/riskapp/api/aes-factors/multiDelete', data, {observe: 'response'});
    }
}
