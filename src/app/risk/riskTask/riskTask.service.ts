import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../app.constants';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {RiskTaskDTO} from '../riskTask/riskTaskDTO';
import {RiskNotificationDTO} from '../riskTask/riskNotificationDTO';
import {UserDto} from '../../gateway/user/UserDto';

@Injectable()
export class RiskTaskService {

    constructor(private http: HttpClient) {

    }

    getAllTask(riskTaskDTO: RiskTaskDTO, data, req?: any): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + 'riskapp/api/getAllTasksPage', riskTaskDTO, {params: data, observe: 'response'});
    }

    getAllMonitorType(): Observable<any> {
        return this.http.get(SERVER_API_URL + 'riskapp/api/all-monitor-types', {observe: 'response'});
    }

    //新增任务
    createRiskTask(riskTaskDTO: RiskTaskDTO): Observable<HttpResponse<RiskTaskDTO>> {
        return this.http.post<RiskTaskDTO>(SERVER_API_URL + 'riskapp/api/report-tasks', riskTaskDTO, {observe: 'response'});
    }

    deleteTask(taskId) {
        return this.http.delete(SERVER_API_URL + 'riskapp/api/deleteTask/' + taskId);
    }

    enableTask(taskId) {
        return this.http.delete(SERVER_API_URL + 'riskapp/api/enableTask/' + taskId);
    }

    deleteTaskAll(data): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + '/riskapp/api/deleteTaskAll', data, {observe: 'response'});
    }

    getTaskById(taskId): Observable<HttpResponse<any>> {
        return this.http.get(SERVER_API_URL + 'riskapp/api/getTaskById/' + taskId, {observe: 'response'});
    }

    updateTask(RiskTaskDTO: RiskTaskDTO): Observable<HttpResponse<RiskTaskDTO>> {
        return this.http.put<RiskTaskDTO>(SERVER_API_URL + 'riskapp/api/updateTask', RiskTaskDTO, {observe: 'response'});
    }

    getTypes(): Observable<HttpResponse<any>> {
        return this.http.get(SERVER_API_URL + 'riskapp/api/getAllCatalog', {observe: 'response'});
    }

    getMonitorTypeName(monitorTypeId): Observable<HttpResponse<any>> {
        return this.http.get(SERVER_API_URL + 'riskapp/api/monitor-types/' + monitorTypeId, {observe: 'response'});
    }

    // 获取有效的任务
    getEffectTask(riskTaskDTO: RiskTaskDTO) {
        return this.http.post(SERVER_API_URL + 'riskapp/api/getAllTasksPage', riskTaskDTO, {observe: 'response'});
    }

    getAllUser(): Observable<any> {
        return this.http.get(SERVER_API_URL + 'uaa/api/users', {observe: 'response'});
    }

    //新增任务通知人
    createRiskNotification(riskNotificationDTO: RiskNotificationDTO): Observable<HttpResponse<RiskNotificationDTO>> {
        return this.http.post<RiskNotificationDTO>(SERVER_API_URL + 'riskapp/api/report-notifications', riskNotificationDTO, {observe: 'response'});
    }

    getRiskNotification(riskId): Observable<HttpResponse<any>> {
        return this.http.get(SERVER_API_URL + 'riskapp/api/getReportNotificationList/' + riskId, {observe: 'response'});
    }

    updateRiskNotification(riskNotificationDTO: RiskNotificationDTO): Observable<HttpResponse<RiskNotificationDTO>> {
        return this.http.post<RiskNotificationDTO>(SERVER_API_URL + 'riskapp/api/report-notifications', riskNotificationDTO, {observe: 'response'});
    }

    deleteRiskNotification(taskId) {
        return this.http.delete(SERVER_API_URL + 'riskapp/api/deleteNotification/' + taskId);
    }

    sendEmail(data): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + '/riskapp/api/sendEmail', data, {observe: 'response'});
    }

    getSpecifiedUser(userDTO: UserDto): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + '/uaa/api/userPages', userDTO, {observe: 'response'});
    }

    /**
     * 更新下载路径
     * @param data
     */
    updateDownloadPath(taskId: string, downloadPath: string) {
        return this.http.put(SERVER_API_URL + 'riskapp/api/download-path/' + taskId, downloadPath, {observe: 'response'});
    }
}
