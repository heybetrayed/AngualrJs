import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../app.constants';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {RiskRegTaskDTO} from './riskRegTaskDTO';
import {ItrlLimit} from '../../points/itrlLimit/itrlLimit-dto';
import {ItrlEventDto} from '../../points/itrlEvent/itrlEvent-dto';
import {RiskDocumentsDTO} from './riskDocumentsDTO';

@Injectable()
export class RiskRegTaskService {

    constructor(
        private http: HttpClient
    ) {

    }

    //获取部门
    getOrganizations(): Observable<any> {
        return this.http.get(SERVER_API_URL + 'uaa/api/getAllOrganization', {observe: 'response'});
    }

    //新增任务  文档
    createRiskRegTask(riskRegTaskDTO: RiskRegTaskDTO): Observable<HttpResponse<RiskRegTaskDTO>> {
        return this.http.post<RiskRegTaskDTO>(SERVER_API_URL + 'riskapp/api/createRegTaskAndDocuments', riskRegTaskDTO, {observe: 'response'});
    }

    getAllRegTask(riskRegTaskDTO: RiskRegTaskDTO, data, req?: any): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + 'riskapp/api/getAllRegTasksPage', riskRegTaskDTO, {params: data, observe: 'response'});
    }

    //保存文件
    saveDocumentByTask(riskRegTaskDTO: RiskRegTaskDTO): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + 'riskapp/api/saveDocumentByTask', riskRegTaskDTO, {observe: 'response'});
    }





}
