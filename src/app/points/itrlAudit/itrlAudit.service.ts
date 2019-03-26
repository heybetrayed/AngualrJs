import { Injectable } from '@angular/core';
import {SERVER_API_URL} from '../../app.constants';
import {Observable} from 'rxjs/Observable';
import {TransferDTO} from '../itrlAdjust/itrlAdjust-dto';
import {HttpClient, HttpResponse} from '@angular/common/http';


@Injectable()
export class ItrlAuditService {

    constructor(
      private http: HttpClient
    ) {

    }
    get(id): Observable<HttpResponse<any>>{
        return this.http.get<any>(SERVER_API_URL + 'integralapp/api/transfer/'+id, {observe: 'response'});
    }

    edit(transferDTO:TransferDTO): Observable<HttpResponse<any>>{
        return this.http.post<any>(SERVER_API_URL + 'integralapp/api/approveTransfer', transferDTO, {observe: 'response'});
    }
}
