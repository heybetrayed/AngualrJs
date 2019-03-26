import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {SERVER_API_URL} from '../../app.constants';
import {UserDto} from "./UserDto";
import {HttpClient, HttpResponse} from '@angular/common/http';

@Injectable()
export class UserService {

    constructor(
      private http: HttpClient
    ) {

    }

    getUser(id): Observable<HttpResponse<UserDto>>{
        return this.http.get<UserDto>(SERVER_API_URL + 'uaa/api/users/'+id,{observe: 'response'});
    }

    create(userDto: UserDto): Observable<HttpResponse<UserDto>> {
        return this.http.post<UserDto>(SERVER_API_URL + 'uaa/api/users', userDto, { observe: 'response'});
    }

    editUser(userDto:UserDto): Observable<HttpResponse<UserDto>>{
        return this.http.put<UserDto>(SERVER_API_URL + 'uaa/api/users', userDto,{observe: 'response'});
    }

    getUserLogin(): Observable<HttpResponse<any>>{
        return this.http.get(SERVER_API_URL + 'uaa/api/account',{observe: 'response'});
    }

    getAuthorities(): Observable<any>{
        return this.http.get(SERVER_API_URL + 'uaa/api/getAllauthorities',{observe: 'response'});
    }

    getOrganizations(): Observable<any>{
        return this.http.get(SERVER_API_URL + 'uaa/api/getAllOrganization',{observe: 'response'});
    }



}
