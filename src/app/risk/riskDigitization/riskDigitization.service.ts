import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {RiskDigitizationDTO} from './risk-digitization-dto';
import {SERVER_API_URL} from '../../app.constants';
import {Observable} from 'rxjs/Rx';
import {RiskRegTaskDTO} from '../riskRegTask/riskRegTaskDTO';
import {MonitorRecordDTO} from './monitor-record-dto';

@Injectable()
export class RiskDigitizationService {

    constructor(
        private http: HttpClient
    ) {

    }

    // 保存数字化监控-record信息
    saveRiskDigitization(monitorRecord: MonitorRecordDTO): Observable<HttpResponse<RiskRegTaskDTO>> {
        return this.http.post<RiskRegTaskDTO>(SERVER_API_URL + 'riskapp/api/monitor-records', monitorRecord, {observe: 'response'});
    }

    listAllRiskDigitization(riskDigitizationDTO: RiskDigitizationDTO, data, req?: any) {
        return this.http.post(SERVER_API_URL + 'riskapp/api/monitor-records-page', riskDigitizationDTO, {
            params: data,
            observe: 'response'
        });
    }

    getTemplate(id): Observable<HttpResponse<any>> {
        return this.http.get(SERVER_API_URL + '/riskapp/api/table-temps/' + id, {observe: 'response'});
    }

    getAllDigitizationType(): Observable<HttpResponse<any>> {
        return this.http.get(SERVER_API_URL + '/riskapp/api/getAllDigitizationType/' + 0, {observe: 'response'});
    }

    getAllDataInfos(id): Observable<HttpResponse<any>> {
        return this.http.get(SERVER_API_URL + '/riskapp/api/getDataInfo/record/' + id, {observe: 'response'});
    }

    // getAllTableTemp(id): Observable<HttpResponse<any>> {
    //     return this.http.get(SERVER_API_URL + '/riskapp/api/tableTemp/type/' + id,{observe:'response'});
    // }

    getAllTables(data): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + '/riskapp/api/monitor-record/tables', data, {observe: 'response'});
    }

    saveAllTables(tableData, recordId,status): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + '/riskapp/api/monitor-record/tables/save/' + recordId + '/' + status + '/', tableData, {observe: 'response'});
    }


    getOrganization(): Observable<HttpResponse<any>> {
        return this.http.get(SERVER_API_URL + '/riskapp/api/getOrganization', {observe: 'response'});
    }


    getMonitorRecordDTO(monitorRecordId): Observable<HttpResponse<any>> {
        return this.http.get(SERVER_API_URL + '/riskapp/api/monitor-records/' + monitorRecordId, {observe: 'response'});
    }


    getAllTablesProcessInstance(procInstId :string ,data): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + '/riskapp/api/getAllTablesProcessInstance/'+ procInstId, data, {observe: 'response'});
    }
}
