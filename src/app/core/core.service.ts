import { Injectable } from '@angular/core';
import {createRequestOption} from "./http/request-util";
import {Observable} from "rxjs/Observable";
import {SERVER_API_URL} from "../app.constants";
import {Application} from '../layout/header/application';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Permission} from '../layout/menu-left/permission';

@Injectable()
export class CoreService {

    constructor(
      private http: HttpClient
    ) {

    }

    // 根据当前登录人的权限显示系统
    getApplicationsByRole(req?: any):Observable<HttpResponse<Application[]>> {
        const options = createRequestOption(req);
        return this.http.get<Application[]>(SERVER_API_URL + 'uaa/api/getApplicationsByRole', { params: options, observe: 'response'});
    }

    searchPermissionByAppId(appId: number,req?: any):Observable<HttpResponse<Permission[]>> {
        const options = createRequestOption(req);
         return this.http.get<Permission[]>(SERVER_API_URL + 'uaa/api/searchPermissionByAppId/'+`${appId}`, { params: options, observe: 'response'});
    }

}
