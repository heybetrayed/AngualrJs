import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../app.constants';
import {HttpClient, HttpResponse} from '@angular/common/http';

@Injectable()
export class RiskTempConfigService {

    constructor(private http: HttpClient) {

    }


    getTypes(): Observable<HttpResponse<any>> {
        return this.http.get(SERVER_API_URL + 'riskapp/api/monitor-types',{observe:'response'});
    }

    disable(id): Observable<HttpResponse<any>> {
        return this.http.delete(SERVER_API_URL + 'riskapp/api/disableTableTemp/' + id,{observe:'response'});
    }

    disableAll(data): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + 'riskapp/api/disableAllTableTemps',data,{observe:'response'});
    }

    enable(id): Observable<HttpResponse<any>> {
        return this.http.delete(SERVER_API_URL + 'riskapp/api/enableTableTemp/' + id,{observe:'response'});
    }


    getTemplate(data, params): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + 'riskapp/api/table-temps/filter', data, {params:params,observe: 'response'});
    }
    addTemplate(data): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + 'riskapp/api/table-temps', data, {observe: 'response'});
    }
    editTemplate(data): Observable<HttpResponse<any>> {
        return this.http.put(SERVER_API_URL + 'riskapp/api/table-temps', data, {observe: 'response'});
    }


}
