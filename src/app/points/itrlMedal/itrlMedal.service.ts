import {Injectable} from '@angular/core';
import {Http, Response, ResponseContentType} from '@angular/http';
import {DditDto} from '../datamanage/ddit-dto';
import {Observable} from 'rxjs/Observable';
import {ResponseWrapper} from '../../core/http/response-wrapper.model';
import { SERVER_API_URL} from '../../app.constants';
import {ItrlMedalDTO} from './itrlMedal-dto';
import {ItrlMemDTO} from '../itrlAdjust/itrlAdjust-dto';
import {HttpClient, HttpResponse} from '@angular/common/http';

@Injectable()
export class ItrlMedalService {
    constructor(
        private http: HttpClient
    ) {

    }
    getItrlTy(): Observable<HttpResponse<any>>{
        return this.http.get<any>(SERVER_API_URL + 'integralapp/api/getItrlTies', {observe: 'response'});
    }

    get(id): Observable<HttpResponse<ItrlMedalDTO>>{
        return this.http.get<ItrlMedalDTO>(SERVER_API_URL + 'integralapp/api/itrlMedals/'+id, {observe: 'response'});
    }

    create(itrlMedalDTO: ItrlMedalDTO): Observable<HttpResponse<ItrlMedalDTO>> {
        return this.http.post<ItrlMedalDTO>(SERVER_API_URL + 'integralapp/api/itrlMedals', itrlMedalDTO, {observe: 'response'});
    }

    edit(itrlMedalDTO:ItrlMedalDTO): Observable<HttpResponse<any>>{
        return this.http.put<any>(SERVER_API_URL + 'integralapp/api/itrlMedals', itrlMedalDTO, {observe: 'response'});
    }

    editLev(itrlMedalDTO:ItrlMedalDTO): Observable<HttpResponse<any>>{
        itrlMedalDTO.updateDate = new Date();
        itrlMedalDTO.updateBy = "admin";
        return this.http.put<HttpResponse<any>>(SERVER_API_URL + 'integralapp/api/_update/itrlMedals', itrlMedalDTO, {observe: 'response'});
    }
}