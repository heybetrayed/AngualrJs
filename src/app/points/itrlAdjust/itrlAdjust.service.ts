import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../app.constants';
import {ItrlMemDTO, TransferDTO} from './itrlAdjust-dto';
import {HttpClient, HttpResponse} from '@angular/common/http';

@Injectable()
export class ItrlAdjustService {

    constructor(
        private http: HttpClient
    ) {

    }

    search(itrlMemDTO: ItrlMemDTO): Observable<HttpResponse<ItrlMemDTO>> {
        return this.http.post<ItrlMemDTO>(SERVER_API_URL + 'integralapp/api/getItrlMems', itrlMemDTO, {observe: 'response'});
    }

    edit(transferDTO: TransferDTO): Observable<HttpResponse<ItrlMemDTO>> {
        return this.http.post<ItrlMemDTO>(SERVER_API_URL + 'integralapp/api/createTransfer', transferDTO, {observe: 'response'});
    }
}