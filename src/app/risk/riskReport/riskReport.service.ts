import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../app.constants';
import {RiskReportDto} from './riskReportDto';
import {RiskAnalyzeDto} from './riskAnalyzeDto';
import {RiskTaskDTO} from '../riskTask/riskTaskDTO';

@Injectable()
export class RiskReportService {

    constructor(
        private http: HttpClient
    ) {

    }

    getAllRecords(data, pagination): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + '/riskapp/api/report-records/filter', data, {params: pagination, observe: 'response'});
    }

    getAllTasks(): Observable<HttpResponse<any>> {
        return this.http.get(SERVER_API_URL + '/riskapp/api/searchAllReportTasks', {observe: 'response'});
    }

    createRecord(riskReportDto: RiskReportDto): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + '/riskapp/api/report-records', riskReportDto, {observe: 'response'});
    }

    getMonitorInfos(riskReportDto: RiskReportDto): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + '/riskapp/api/getMonitorInfos', riskReportDto, {observe: 'response'});
    }

    saveAnalyzes(monitorRightInfos: Array<RiskAnalyzeDto>, status): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + '/riskapp/api/saveAnalyzes/' + status, monitorRightInfos, {observe: 'response'});
    }

    getAllDigitizationType(): Observable<HttpResponse<any>> {
        return this.http.get(SERVER_API_URL + '/riskapp/api/getAllDigitizationType/' + 1, {observe: 'response'});
    }

    createDocx(taskId: number): Observable<HttpResponse<RiskTaskDTO>> {
        return this.http.get<RiskTaskDTO>(SERVER_API_URL + '/riskapp/api/docx/' + taskId + '/', {observe: 'response'});
    }

    downLoadFile(riskTask: RiskTaskDTO) {
        return this.http.post(SERVER_API_URL + 'riskapp/api/doc/download', riskTask, {responseType: 'blob'});
    }


    getReportRecordDto(reportId): Observable<HttpResponse<any>> {
        return this.http.get(SERVER_API_URL + '/riskapp/api/report-records/' + reportId, {observe: 'response'});
    }

    getMonitorInfosProcessInstance(procInstId :string , riskReportDto: RiskReportDto): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + '/riskapp/api/getMonitorInfosProcessInstance/' + procInstId , riskReportDto, {observe: 'response'});
    }
}
