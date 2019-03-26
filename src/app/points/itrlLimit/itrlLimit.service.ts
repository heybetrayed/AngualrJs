import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Http, Response, ResponseContentType} from '@angular/http';
import { SERVER_API_URL} from '../../app.constants';
import {ResponseWrapper} from "../../core/http/response-wrapper.model";
import {ItrlLimit} from './itrlLimit-dto';
import {HttpClient, HttpResponse} from '@angular/common/http';


@Injectable()
export class ItrlLimitService {

    constructor(
      private http: HttpClient
    ) {

    }

    getItrlTy(): Observable<HttpResponse<any>>{
        return this.http.get<any>(SERVER_API_URL + 'integralapp/api/getItrlTies', {observe: 'response'});
    }

    getItrlLimitLists(itrlLimit:ItrlLimit):Observable<HttpResponse<ItrlLimit>>{
        return this.http.post<ItrlLimit>( SERVER_API_URL + 'integralapp/api/getItrlLimitList',itrlLimit, {observe: 'response'});
    }

    get(id): Observable<HttpResponse<ItrlLimit>>{
        return this.http.get<ItrlLimit>(SERVER_API_URL + 'integralapp/api/itrlLimits/'+id, {observe: 'response'});
    }

    edit(itrlLimit:ItrlLimit): Observable<HttpResponse<ItrlLimit>>{
        return this.http.put<ItrlLimit>(SERVER_API_URL + 'integralapp/api/itrlLimits',itrlLimit, {observe: 'response'});
    }

    checkItrlLimitCode(itrlLimit:ItrlLimit): Observable<HttpResponse<any>>{
        return this.http.post<any>(SERVER_API_URL + 'integralapp/api/checkItrlLimitCode',itrlLimit, {observe: 'response'});
    }
}
