import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../app.constants';
import {ItrlMemDTO} from '../itrlAdjust/itrlAdjust-dto';
import {HttpClient, HttpResponse} from '@angular/common/http';

@Injectable()
export class ItrlMemService {
    constructor(
        private http: HttpClient
    ) {

    }

    create(itrlMemDto: ItrlMemDTO): Observable<HttpResponse<ItrlMemDTO>> {
        return this.http.post<ItrlMemDTO>(SERVER_API_URL + 'integralapp/api/saveItrlMemByDto', itrlMemDto, {observe: 'response'});
    }

    checkItrlMemNo(itrlMemDto: ItrlMemDTO): Observable<HttpResponse<ItrlMemDTO>> {
        return this.http.post<ItrlMemDTO>(SERVER_API_URL + 'integralapp/api/checkItrlMemNo', itrlMemDto, {observe: 'response'});
    }

}