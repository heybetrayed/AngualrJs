import { Injectable } from '@angular/core';
import {SERVER_API_URL} from '../../app.constants';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Application} from '../../layout/header/application';

@Injectable()
export class TreePermissionService {

    constructor(
      private http: HttpClient
    ) {

    }
    getAllRole(): Observable<HttpResponse<any>>{
        return this.http.get(SERVER_API_URL + 'uaa/api/getAllauthorities',{observe: 'response'});
    }

    getPermissionByAppIdUrl(appId): String{
            return SERVER_API_URL + 'uaa/api/getAllPermissionByAppId/' + appId;

    }

    //新增角色和权限关系
    save(strings:any){
        return this.http.post(SERVER_API_URL + 'uaa/api/createAuthorityPermission',strings);
    }

    getPermissionByAppIdAndAuthorityId(appId,roleId): Observable<HttpResponse<any>>{
        return this.http.get(SERVER_API_URL + 'uaa/api/getAllPermissionByAppIdAndAuthorityId/'+appId+"/"+roleId,{observe: 'response'});
    }

    getAllAppByauthorityId(authorityId): Observable<HttpResponse<any>>{
        return this.http.get(SERVER_API_URL + 'uaa/api/getAllAppByauthorityId/'+authorityId,{observe: 'response'});
    }

    //查询系统
    getAllApplications():Observable<HttpResponse<Application>>{
        return this.http.get(SERVER_API_URL + 'uaa/api/getAllApplications',{observe: 'response'});
    }

}
