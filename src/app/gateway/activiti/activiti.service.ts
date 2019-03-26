import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SERVER_API_URL} from '../../app.constants';
import {ActivitiDto} from './activiti-dto';
import {TaskDTO} from './task-dto';

@Injectable()
export class ActivitiService {

    constructor(
        private http: HttpClient
    ) {

    }

    // 获取模型列表
    listAllModels(activitiDto: ActivitiDto, data, req?: any): Observable<HttpResponse<any>> {
        return this.http.get(SERVER_API_URL + 'activitios/repository/models', {params: data, observe: 'response'});
    }

    // 获取参数获取列表
    listAllModelsByParams(activitiDto: ActivitiDto, data, req?: any): Observable<HttpResponse<any>> {
        return this.http.get(SERVER_API_URL + 'activitios/repository/models', {params: data, observe: 'response'});
    }

    // 根据ID获取模型
    getModelById(id: string): Observable<HttpResponse<ActivitiDto>> {
        return this.http.get<ActivitiDto>(SERVER_API_URL + 'riskapp/api/news/' + id, {observe: 'response'});
    }

    // 创建模型
    saveModel(activitiDto: ActivitiDto): Observable<HttpResponse<ActivitiDto>> {
        return this.http.post<ActivitiDto>(SERVER_API_URL + 'activitios/api/workflow/model/create', activitiDto, {observe: 'response'});
    }

    // 删除模型
    deleteModelById(id: string) {
        return this.http.delete(SERVER_API_URL + 'riskapp/api/listDocumentsByTaskId/' + id, {observe: 'response'});
    }

    // 更新模型
    updateModel(activitiDto: ActivitiDto): Observable<HttpResponse<ActivitiDto>> {
        return this.http.put<ActivitiDto>(SERVER_API_URL + 'riskapp/api/news', activitiDto, {observe: 'response'});
    }

    /**
     * 查看审批历史
     * @param processInstId
     */
    listAllTaskHistory(processInstId: string): Observable<HttpResponse<Array<TaskDTO>>> {
        return this.http.get<Array<TaskDTO>>(SERVER_API_URL + 'activitios/api/workflow/historytask/' + processInstId, {observe: 'response'});
    }


    /**
     * 同意
     */
    apply(taskId: string) {
        return this.http.get(SERVER_API_URL + 'activitios/api/workflow/complete/' + taskId, {observe: 'response'});
    }

    /**
     * 退回
     */
    rollback(taskId: string, content: string) {
        return this.http.post<ActivitiDto>(SERVER_API_URL + 'activitios/api/workflow/rollback/' + taskId, content, {observe: 'response'});
    }
}
