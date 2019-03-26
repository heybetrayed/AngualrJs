import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {SERVER_API_URL} from "../../app.constants";
import {permissionDto} from "./permissionDto";
import {HttpClient, HttpResponse} from '@angular/common/http';
import {PermissionDTO} from '../role/roleDto';
import {Application} from '../../layout/header/application';

@Injectable()
export class PermissionsService {

    constructor(private http: HttpClient) {

    }

    //新建权限
    create(permissionDto: permissionDto): Observable<HttpResponse<PermissionDTO>> {
        return this.http.post<PermissionDTO>(SERVER_API_URL + 'uaa/api/permissions', permissionDto,{observe: 'response'});
    }

    //删除权限
    delete(permissionsId){
        return this.http.delete(SERVER_API_URL + 'uaa/api/deletePermission/' +permissionsId);
    }

    //更新权限
    edit(permissionDto: permissionDto): Observable<HttpResponse<PermissionDTO>> {
        return this.http.put<PermissionDTO>(SERVER_API_URL + 'uaa/api/permissions',permissionDto,{observe: 'response'});
    }


    //查询权限
    getPermissionById(permissionsId): Observable<HttpResponse<PermissionDTO>> {
        return this.http.get<PermissionDTO>(SERVER_API_URL + 'uaa/api/permissions/' + permissionsId,{observe: 'response'});
    }

    //根据ID查询权限
    selectPermissionById(permissionsId): Observable<HttpResponse<PermissionDTO>> {
        return this.http.get<PermissionDTO>(SERVER_API_URL + 'uaa/api/getPermissionById/' + permissionsId,{observe: 'response'});
    }

    //根据系统查询对应的权限
    getPermissionByAppIdUrl(appId): String{
        return SERVER_API_URL + 'uaa/api/getAllPermissionByAppId/' + appId;

    }

    //新增角色和权限关系
    save(strings:any){
        return this.http.post(SERVER_API_URL + 'uaa/api/createAuthorityPermission',strings);
    }

    //查询系统
    getAllApplications():Observable<HttpResponse<Application[]>>{
        return this.http.get<Application[]>(SERVER_API_URL + 'uaa/api/getAllApplications',{observe: 'response'});
    }

}
