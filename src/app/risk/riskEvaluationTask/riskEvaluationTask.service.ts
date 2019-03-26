import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../app.constants';
import {HttpClient, HttpResponse} from '@angular/common/http';

@Injectable()
export class RiskEvaluationTaskService {

    constructor(
        private http: HttpClient
    ) {
    }
    
    getTemplate(data, params): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + 'riskapp/api/aes-temps/filter', data, {params: params, observe: 'response'});
    }

    saveTask(data): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + 'riskapp/api/aes-tasks', data, {observe:'response'});
    }

    getTasks(data, params): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + 'riskapp/api/aes-tasks/filter', data, {params: params, observe: 'response'});
    }

    editTask(data): Observable<HttpResponse<any>> {
        return this.http.put(SERVER_API_URL + 'riskapp/api/aes-tasks/', data, {observe: 'response'});
    }

    //禁用
    disable(id) {
        return this.http.delete(SERVER_API_URL + 'riskapp/api/disableAesTask/' + id);
    }
    //启用
    enable(id) {
        return this.http.delete(SERVER_API_URL + 'riskapp/api/enableAesTask/' + id);
    }

    //批量禁用
    disableAll(data): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + '/riskapp/api/disableAllAesTasks', data, {observe: 'response'});
    }


    getInputTable(templateId): Observable<HttpResponse<any>> {
        return this.http.get(SERVER_API_URL + '/riskapp/api/getRelation/' + templateId, {observe: 'response'});
    }
}
