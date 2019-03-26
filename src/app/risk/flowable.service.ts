import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SERVER_API_URL} from '../app.constants';

@Injectable({
    providedIn: 'root'
})
export class FlowableService {

    constructor(
        private http: HttpClient
    ) {

    }

    getFlowableByProcInstId(procInstId): Observable<HttpResponse<any>> {
        return this.http.get(SERVER_API_URL + '/riskapp/api/flowableByProcInstId/' + procInstId, {observe: 'response'});
    }

    /**
     * 更新最新的task
     */
    updateNewTask(flowableId: string) {
        return this.http.put(SERVER_API_URL + 'riskapp/api/flowables/task/' + flowableId, {observe: 'response'});

    }

    /**
     * 驳回
     * @param id
     */
    changeStatus(flowableId: string) {
        return this.http.put(SERVER_API_URL + 'riskapp/api/flowables/status/' + flowableId, {observe: 'response'});
    }
}
