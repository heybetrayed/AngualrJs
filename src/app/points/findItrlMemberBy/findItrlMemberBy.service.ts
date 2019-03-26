import {Observable} from 'rxjs/Observable';
import {Injectable} from '@angular/core';
import {ResponseWrapper} from '../../core/http/response-wrapper.model';
import {Response} from '@angular/http';
import {SERVER_API_URL} from '../../app.constants';
import {ItrlMemDTO} from '../itrlAdjust/itrlAdjust-dto';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {ItrlQueryDto} from './findItrlMemberBy-dto';

@Injectable()
export class FindItrlMemberByService{
    constructor(
        private http: HttpClient
    ) {

    }

    findItrlMem(itrlMemDto: ItrlMemDTO): Observable<HttpResponse<ItrlQueryDto>> {
        return this.http.post<ItrlQueryDto>(SERVER_API_URL + 'integralapp/api/findItrlMem', itrlMemDto, {observe: 'response'});
    }
}