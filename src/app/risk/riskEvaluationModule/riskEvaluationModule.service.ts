import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../app.constants';
import {HttpClient, HttpResponse} from '@angular/common/http';

@Injectable()
export class RiskEvaluationModuleService {
    constructor(
        private http: HttpClient
    ) {

    }

    getModule(data,params): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + '/riskapp/api/aes-modules/filter',data,  {params: params, observe: 'response'});
    }

    createModule(data): Observable<HttpResponse<any>>{
        return this.http.post(SERVER_API_URL + '/riskapp/api/aes-modules', data, {observe: 'response'});
    }

    deleteModule(id): Observable<HttpResponse<any>> {
        return this.http.delete(SERVER_API_URL + '/riskapp/api/aes-modules/' + id, {observe: 'response'});
    }

    enableModule(id): Observable<HttpResponse<any>> {
        return this.http.delete(SERVER_API_URL + '/riskapp/api/enableAesModule/' + id, {observe: 'response'});
    }

    editModule(data): Observable<HttpResponse<any>> {
        return this.http.put(SERVER_API_URL + '/riskapp/api/aes-modules/', data, {observe: 'response'});
    }

    deleteMultiModules(data): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + '/riskapp/api/aes-modules/multiDelete', data, {observe: 'response'});
    }
}
