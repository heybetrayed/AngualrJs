import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../app.constants';

@Injectable()
export class RiskEvaluationRelationService {
    constructor(
        private http: HttpClient
    ) {

    }

    getModule(data, params): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + '/riskapp/api/aes-modules/filter', data, {params: params, observe: 'response'});
    }

    getFactors(params, data): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + '/riskapp/api/aes-factors/filter', data, {params: params, observe: 'response'});
    }

    getTemplate(data, params): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + 'riskapp/api/aes-temps/filter', data, {params: params, observe: 'response'});
    }

    getTypes(data, params): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + '/riskapp/api/aes-types/filter', data, {params: params, observe: 'response'});
    }

    saveRelation(data): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + '/riskapp/api/saveRelation', data, {observe: 'response'});
    }

    getRelation(templateId): Observable<HttpResponse<any>> {
        return this.http.get(SERVER_API_URL + '/riskapp/api/getRelation/' + templateId, {observe: 'response'});
    }

    saveOneRelation(data): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + '/riskapp/api/temp-fac-type-relas', data, {observe: 'response'});
    }

    deleteRelation(data): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + '/riskapp/api/deleteRelation',data,{observe:'response'});
    }
}
