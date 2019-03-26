import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../app.constants';
import {HttpClient, HttpResponse} from '@angular/common/http';

@Injectable()
export class RiskEvaluationTemplateService {

    constructor(
        private http: HttpClient
    ) {

    }

    getTemplate(data, params): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + 'riskapp/api/aes-temps/filter', data, {params: params, observe: 'response'});
    }

    addTemplate(data): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + 'riskapp/api/aes-temps', data, {observe: 'response'});
    }

    deleteTemplate(id): Observable<HttpResponse<any>> {
        return this.http.delete(SERVER_API_URL + 'riskapp/api/aes-temps/' + id, {observe: 'response'});
    }

    enableTemplate(id): Observable<HttpResponse<any>> {
        return this.http.delete(SERVER_API_URL + 'riskapp/api/enableTemplate/' + id, {observe: 'response'});
    }

    editTemplate(data): Observable<HttpResponse<any>> {
        return this.http.put(SERVER_API_URL + 'riskapp/api/aes-temps', data, {observe: 'response'});
    }

    deleteMultiTemplate(data): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL+ 'riskapp/api/aes-temps/multiDelete',data,{observe:'response'});
    }

}
