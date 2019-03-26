import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {SERVER_API_URL} from "../../app.constants";
import {roleDto} from "../role/roleDto";
import {HttpClient, HttpResponse} from '@angular/common/http';
@Injectable()
export class RoleService {

    constructor(
      private http: HttpClient
    ) {

    }


    createRole(roleDto: roleDto): Observable<HttpResponse<roleDto>> {
        return this.http.post<roleDto>(SERVER_API_URL + 'uaa/api/authorities', roleDto, {observe: 'response'});
    }

    getRole(roleId): Observable<HttpResponse<roleDto>>{
        return this.http.get<roleDto>(SERVER_API_URL + 'uaa/api/authorities/'+roleId,{observe: 'response'});
    }

    editRole(roleDto:roleDto): Observable<HttpResponse<roleDto>>{
        return this.http.put<roleDto>(SERVER_API_URL + 'uaa/api/authorities', roleDto, {observe: 'response'});
    }

    getApplications(): Observable<HttpResponse<roleDto>>{
        return this.http.get<roleDto>(SERVER_API_URL + 'uaa/api/getAllApplications',{observe: 'response'});
    }

}
