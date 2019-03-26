import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../app.constants';
import {DditItemDto} from './dditItem-dto';
import {HttpClient, HttpResponse} from '@angular/common/http';

@Injectable()
export class DataItemManagerService {

    constructor(
      private http: HttpClient
    ) {

    }

    get(id): Observable<HttpResponse<DditItemDto>> {
        return this.http.get<DditItemDto>(SERVER_API_URL + 'integralapp/api/dditItems/' + id, {observe: 'response'});
    }

    getDditId(id: number): Observable<HttpResponse<DditItemDto>> {
        return this.http.get<DditItemDto>(SERVER_API_URL + 'integralapp/api/dditItemListByDditId/' + id, {observe: 'response'});
    }

    edit(dditItemDto: DditItemDto): Observable<HttpResponse<DditItemDto>> {
        return this.http.put<DditItemDto>(SERVER_API_URL + 'integralapp/api/dditItems', dditItemDto, {observe: 'response'});
    }

    delete(id: number): Observable<HttpResponse<DditItemDto>> {
        return this.http.post<DditItemDto>(SERVER_API_URL + 'integralapp/api/dditItems', id, {observe: 'response'});
    }

    checkDditItemCode(dditItemDto: DditItemDto): Observable<HttpResponse<DditItemDto>> {
        return this.http.post<DditItemDto>(SERVER_API_URL + 'integralapp/api/checkDditItemCode', dditItemDto, {observe: 'response'});
    }

}
