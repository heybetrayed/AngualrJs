import { Injectable } from '@angular/core';
import {Http, Response, ResponseContentType} from '@angular/http';
import {ResponseWrapper} from "../../core/http/response-wrapper.model";
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from "../../app.constants";
import {ItrlEventDto} from './itrlEvent-dto';
import {HttpClient, HttpResponse} from '@angular/common/http';


@Injectable()
export class ItrlEventService {

    constructor(
      private http: HttpClient
    ) {
    }

    create(itrlEventDto: ItrlEventDto): Observable<HttpResponse<any>> {
        return this.http.post<any>(SERVER_API_URL + 'integralapp/api/itrl-events', itrlEventDto, {observe: 'response'});
    }

    edit(itrlEventDto:ItrlEventDto): Observable<HttpResponse<any>>{
        return this.http.put<any>(SERVER_API_URL + 'integralapp/api/itrl-events', itrlEventDto, {observe: 'response'});
    }

    getEvent(eventId): Observable<HttpResponse<ItrlEventDto>>{
        return this.http.get<ItrlEventDto>(SERVER_API_URL + 'integralapp/api/itrl-events/'+eventId, {observe: 'response'});
    }


    getAllItrlChanges():Observable<HttpResponse<ItrlEventDto[]>>{
        return this.http.get<ItrlEventDto[]>( SERVER_API_URL + 'integralapp/api/getAllItrlChanges', {observe: 'response'});
    }
}
