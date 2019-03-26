import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../app.constants';
import {ItrlRecordDto} from './itrlRecord-dto';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {ItrlMemDTO} from '../itrlAdjust/itrlAdjust-dto';

@Injectable()
export class ItrlRecordService {

    constructor(private http: HttpClient) {

    }

    getItrlMember(id: string): Observable<HttpResponse<ItrlMemDTO>> {
        return this.http.get<ItrlMemDTO>(SERVER_API_URL + 'integralapp/api/itrlMems/' + id,{observe: 'response'});
    }

    get(id: string): Observable<HttpResponse<any>> {
        return this.http.get(SERVER_API_URL + 'integralapp/api/itrlRaises/' + id,{observe: 'response'});
    }

    create(itrlRecordDto: ItrlRecordDto): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + 'integralapp/api/itrlRaises', itrlRecordDto,{observe: 'response'});
    }

    edit(id: string): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + 'integralapp/api/itrlRaises', id,{observe: 'response'});
    }

    delete(id: string): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + 'integralapp/api/itrlRaises', id,{observe: 'response'});
    }
}
