import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {SERVER_API_URL} from "../../app.constants";
import {systemDto} from "./systemDto";
import {HttpClient, HttpResponse} from '@angular/common/http';

@Injectable()
export class SystemService {

    constructor(
      private http: HttpClient
    ) {

    }

    create(systemDto: systemDto): Observable<HttpResponse<systemDto>> {
        return this.http.post<systemDto>(SERVER_API_URL + 'uaa/api/applications', systemDto,{observe: 'response'});
    }

    getSystem(systemId): Observable<HttpResponse<systemDto>>{
        return this.http.get<systemDto>(SERVER_API_URL + 'uaa/api/applications/'+systemId,{observe: 'response'});
    }

    edit(systemDto:systemDto): Observable<HttpResponse<systemDto>>{
        return this.http.put<systemDto>(SERVER_API_URL + 'uaa/api/applications', systemDto,{observe: 'response'});
    }

}
