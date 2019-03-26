import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Http, Response} from '@angular/http';
import {SERVER_API_URL} from '../../app.constants';
import {ResponseWrapper} from '../../core/http/response-wrapper.model';
import {xmlDto} from './xmlDTO';
import {HttpClient, HttpResponse} from '@angular/common/http';

@Injectable()
export class WorkflowService {

    constructor(private httpClient: HttpClient) {

    }

    sendXML(xmlDto?: xmlDto): Observable<HttpResponse<any>> {
        return this.httpClient.post(SERVER_API_URL + 'workflow/process-api/repository/deployments', xmlDto, {observe: 'response'});
    }

    // 获取用户

    // 获取部门

}
