import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse,} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SERVER_API_URL} from '../../app.constants';
import {RiskMonitorTypeDTO} from '../riskMonitorType/riskMonitorTypeDTO';
import {RiskMonitorTypeTempDTO} from './riskMonitorTypeTempDTO';


@Injectable()
export class RiskMonitorTypeTempService {

    constructor(
        private http: HttpClient
    ) {

    }



    getAllMonitorTypes(): Observable<HttpResponse<any>> {
        return this.http.get(SERVER_API_URL + '/riskapp/api/all-monitor-types', {observe: 'response'});
    }



    getMonitorTypesDetailsById(monitorTypeId): Observable<HttpResponse<any>> {
        return this.http.get(SERVER_API_URL + '/riskapp/api/getMonitorTypesDetailsById/' + monitorTypeId, {observe: 'response'});
    }




    getTableTemp(monitorTypeId): Observable<HttpResponse<any>> {
        return this.http.get(SERVER_API_URL + '/riskapp/api/getTableTemp/' + monitorTypeId, {observe: 'response'});
    }



    saveAllSelectTableTemp(data:Array<RiskMonitorTypeTempDTO>): Observable<HttpResponse<any>> {
        return this.http.post<any>(SERVER_API_URL + 'riskapp/api/saveAllSelectTableTemp', data ,{observe: 'response'});
    }



    deleteAllSelectTableTemp(monitorTypeId) {
        return this.http.delete(SERVER_API_URL + 'riskapp/api/deleteAllSelectTableTemp/' + monitorTypeId);
    }

}
