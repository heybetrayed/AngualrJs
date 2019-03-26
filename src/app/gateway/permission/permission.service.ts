import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Http, Response} from "@angular/http";
import {SERVER_API_URL} from "../../app.constants";
import {ResponseWrapper} from "../../core/http/response-wrapper.model";
import {permissionDto} from "./permissionDto";

@Injectable()
export class PermissionService {

    constructor(private http: Http) {

    }

    create(permissionDto: permissionDto): Observable<ResponseWrapper> {
        return this.http.post(SERVER_API_URL + 'uaa/api/permissions', permissionDto).map((res: Response) => this.convertResponse(res));
    }


  /*  deleteAuthorityPermission(permissionsId) {
        return this.http.delete(SERVER_API_URL + 'uaa/api/deleteAuthorityPermission/'+permissionsId).map((res: Response) => this.convertResponse(res));
    }*/

    delete(permissionsId){
        return this.http.delete(SERVER_API_URL + 'uaa/api/deletePermission/' +permissionsId).map((res: Response) => {});
    }

    edit(permissionDto: permissionDto): Observable<ResponseWrapper> {
        return this.http.put(SERVER_API_URL + 'uaa/api/permissions', permissionDto).map((res: Response) => this.convertResponse(res));
    }


    getApplication(): Observable<ResponseWrapper> {
        return this.http.get(SERVER_API_URL + 'uaa/api/getAllApplications').map((res: Response) => this.convertResponse(res));
    }

    getPermission(appId): Observable<ResponseWrapper> {
        return this.http.get(SERVER_API_URL + 'uaa/api/getPermissionByAppId/' + appId).map((res: Response) => this.convertResponse(res));
    }

    getPermissionById(permissionsId): Observable<ResponseWrapper> {
        return this.http.get(SERVER_API_URL + 'uaa/api/getPermissionById/' + permissionsId).map((res: Response) => this.convertResponse(res));
    }



    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }
}
