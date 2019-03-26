import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Http, Response, ResponseContentType} from '@angular/http';
import { SERVER_API_URL} from '../../app.constants';
import {ResponseWrapper} from "../../core/http/response-wrapper.model";
import {ItrlChangeDTO } from "./itrlChangeDTO";
import {HttpClient, HttpResponse} from '@angular/common/http';
import {ItrlLimitDTO} from './itrlLimitDTO';


@Injectable()
export class ItrlChangeService {

    constructor(
      private http: HttpClient
    ) {

    }

    get(id): Observable<HttpResponse<ItrlLimitDTO>>{
        return this.http.get<ItrlLimitDTO>(SERVER_API_URL + 'integralapp/api/itrl-Limits/'+id, {observe: 'response'});
    }

    create(itrlChangeDTO: ItrlChangeDTO): Observable<HttpResponse<ItrlChangeDTO>> {
        return this.http.post<ItrlChangeDTO>(SERVER_API_URL + 'integralapp/api/itrlChanges', itrlChangeDTO, {observe: 'response'});
    }

    edit(itrlChangeDTO: ItrlChangeDTO): Observable<HttpResponse<ItrlChangeDTO>>{
        return this.http.put<ItrlChangeDTO>(SERVER_API_URL + 'integralapp/api/itrlChanges', itrlChangeDTO, {observe: 'response'});
    }

    delete(id:number): Observable<HttpResponse<any>>{
        return this.http.post<any>(SERVER_API_URL + 'integralapp/api/ddits', id, {observe: 'response'});
    }

    //统计规则
    findChangeCount(itrlChangeDTO: ItrlChangeDTO):Observable<HttpResponse<any>>{
        return this.http.post<any>( SERVER_API_URL + 'integralapp/api/findChangeCount',itrlChangeDTO, {observe: 'response'});
    }

    updateChangeProduct(itrlChangeDTO: ItrlChangeDTO):Observable<HttpResponse<any>>{
        return this.http.put<any>( SERVER_API_URL + 'integralapp/api/updateChangeProduct',itrlChangeDTO, {observe: 'response'});
    }

    checkName(itrlChangeDTO: ItrlChangeDTO):Observable<HttpResponse<any>>{
        return this.http.post<any>( SERVER_API_URL + 'integralapp/api/checkName',itrlChangeDTO, {observe: 'response'});
    }

    getAllItrlChanges():Observable<HttpResponse<ItrlChangeDTO[]>>{
        return this.http.get<ItrlChangeDTO[]>( SERVER_API_URL + 'integralapp/api/getAllItrlChanges', {observe: 'response'});
    }
}
