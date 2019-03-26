import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../app.constants';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {RiskMonitorTypeDTO} from './riskMonitorTypeDTO';

@Injectable()
export class RiskMonitorTypeService {

    constructor(
        private http: HttpClient
    ) {

    }
/*
    getAllMonitorType(riskMonitorTypeDTO: RiskMonitorTypeDTO, data, req?: any): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + 'riskapp/api/getAllMonitorTypesPage', riskMonitorTypeDTO, {
            params: data,
            observe: 'response'
        });
    }*/


    getAllMonitorType(riskMonitorTypeDTO: RiskMonitorTypeDTO, data, req?: any): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + 'riskapp/api/getAllMonitorTypes', riskMonitorTypeDTO,{params: data,observe: 'response'});
    }

    saveMonitorType(riskMonitorTypeDTO: RiskMonitorTypeDTO): Observable<HttpResponse<RiskMonitorTypeDTO>> {
        return this.http.post<RiskMonitorTypeDTO>(SERVER_API_URL + 'riskapp/api/createMonitor', riskMonitorTypeDTO, {observe: 'response'});
    }

    saveMonitorTypeDetail(riskMonitorTypeDTO: RiskMonitorTypeDTO): Observable<HttpResponse<RiskMonitorTypeDTO>> {
        return this.http.post<RiskMonitorTypeDTO>(SERVER_API_URL + 'riskapp/api/createMonitorTypeDetail', riskMonitorTypeDTO, {observe: 'response'});
    }

    getMonitorTypeById(monitorTypeId): Observable<HttpResponse<any>> {
        return this.http.get(SERVER_API_URL + 'riskapp/api/getMonitorTypesById/' + monitorTypeId, {observe: 'response'});
    }

    updateMonitorType(riskMonitorTypeDTO: RiskMonitorTypeDTO): Observable<HttpResponse<RiskMonitorTypeDTO>> {
        return this.http.put<RiskMonitorTypeDTO>(SERVER_API_URL + 'riskapp/api/updateMonitorType', riskMonitorTypeDTO, {observe: 'response'});
    }

    //禁用
    disable(monitorTypeId) {
        return this.http.delete(SERVER_API_URL + 'riskapp/api/disableMonitorType/' + monitorTypeId);
    }
    //启用
    enable(monitorTypeId) {
        return this.http.delete(SERVER_API_URL + 'riskapp/api/enableMonitorType/' + monitorTypeId);
    }

    //批量禁用
    disableAll(data): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + '/riskapp/api/disableAllMonitorTypes', data, {observe: 'response'});
    }

    getGroup(): Observable<HttpResponse<any>> {
        return this.http.get(SERVER_API_URL + '/riskapp/api/getGroup', {observe: 'response'});
    }

    getChilds(pid): Observable<HttpResponse<any>> {
        return this.http.get(SERVER_API_URL + 'riskapp/api/getChilds/' + pid, {observe: 'response'});
    }

    deleteMonitorTypeDetail(id){
        return this.http.delete(SERVER_API_URL + 'riskapp/api/deleteMonitorTypeDetail/' + id);
    }

    getMonitorById(monitorTypeId): Observable<HttpResponse<any>> {
        return this.http.get(SERVER_API_URL + 'riskapp/api/getMonitorById/' + monitorTypeId, {observe: 'response'});
    }

    getAllMonitorTypeDetails(): Observable<HttpResponse<any>> {
        return this.http.get(SERVER_API_URL + 'riskapp/api/getAllMonitorTypeDetails', {observe: 'response'});
    }

    getMonitorTypeDetailById(monitorTypeDetailId): Observable<HttpResponse<any>> {
        return this.http.get(SERVER_API_URL + 'riskapp/api/getMonitorTypeDetailById/' + monitorTypeDetailId, {observe: 'response'});
    }


}
