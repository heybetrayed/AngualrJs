import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../app.constants';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {RiskRegTaskDTO} from './riskRegTaskDTO';
import {ItrlLimit} from '../../points/itrlLimit/itrlLimit-dto';
import {ItrlEventDto} from '../../points/itrlEvent/itrlEvent-dto';
import {RiskDocumentsDTO} from './riskDocumentsDTO';
import {ResponseContentType} from '@angular/http';
import {tap} from 'rxjs/operators';

@Injectable()
export class RiskDocumentsService {

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

    //获取所有文档
    getAllDocuments(riskDocumentsDTO: RiskDocumentsDTO, data, req?: any): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + 'riskapp/api/getAllDocumentsPage', riskDocumentsDTO, {params: data, observe: 'response'});
    }

    //获取文档根据ID
    getDocumentsById(id): Observable<HttpResponse<RiskDocumentsDTO>> {
        return this.http.get<RiskDocumentsDTO>(SERVER_API_URL + 'riskapp/api/getDocumentsById/' + id, {observe: 'response'});
    }


    downLoadFile(riskDocumentsDTO: RiskDocumentsDTO): Observable<any> {
        return this.http.post(SERVER_API_URL + 'riskapp/api/download', riskDocumentsDTO, {responseType: 'blob'});
    }

    // 根据taskId获取文件
    listDocumentsBytaskId(taskId): Observable<HttpResponse<Array<RiskDocumentsDTO>>> {
        return this.http.get<Array<RiskDocumentsDTO>>(SERVER_API_URL + 'riskapp/api/listDocumentsByTaskId/' + taskId, {observe: 'response'});
    }


    //更新查看次数
    updateViewCount(riskDocumentsDTO: RiskDocumentsDTO): Observable<HttpResponse<any>> {
        return this.http.put(SERVER_API_URL + '/riskapp/api/updateViewCount/', riskDocumentsDTO, {observe: 'response'});
    }

    //更新下载次数
    updateDownLoadCount(riskDocumentsDTO: RiskDocumentsDTO): Observable<HttpResponse<any>> {
        return this.http.put(SERVER_API_URL + '/riskapp/api/updateDownLoadCount/', riskDocumentsDTO, {observe: 'response'});
    }


}
