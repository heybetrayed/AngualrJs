import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {SERVER_API_URL} from "../../app.constants";
import {ItrlMemDTO} from '../itrlAdjust/itrlAdjust-dto';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';


@Injectable()
export class SaveMemService {

    constructor(
      private http: HttpClient
    ) {

    }

    create(itrlMemDto: ItrlMemDTO): Observable<HttpResponse<ItrlMemDTO>> {
        return this.http.post<ItrlMemDTO>(SERVER_API_URL + 'integralapp/api/saveItrlMemByDto',itrlMemDto,{observe: 'response'});
    }

    upload(formData:FormData,options:HttpParams): Observable<HttpResponse<ItrlMemDTO>> {
        return this.http.post<ItrlMemDTO>(SERVER_API_URL + 'integralapp/api/bathSaveMem',formData,{params: options,observe: 'response'});
    }

    joinMobileByMemResource(itrlMemDto: ItrlMemDTO): Observable<HttpResponse<ItrlMemDTO>> {
        return this.http.post<ItrlMemDTO>(SERVER_API_URL + 'integralapp/api/joinMobileByMem',itrlMemDto,{observe: 'response'});
    }


}
