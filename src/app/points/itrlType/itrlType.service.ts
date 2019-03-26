import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {SERVER_API_URL} from '../../app.constants';
import {ResponseWrapper} from "../../core/http/response-wrapper.model";
import {ItrlTypeDTO} from './itrlType-dto';
import {HttpClient, HttpResponse} from '@angular/common/http';


@Injectable()
export class ItrlTypeService {

    constructor(
      private http: HttpClient
    ) {

    }

    get(id): Observable<HttpResponse<ItrlTypeDTO>>{
        return this.http.get<ItrlTypeDTO>(SERVER_API_URL + 'integralapp/api/itrlTies/'+id,{observe: 'response'});
    }

    edit(itrlTypeDTO:ItrlTypeDTO): Observable<HttpResponse<ItrlTypeDTO>>{
        return this.http.put<ItrlTypeDTO>(SERVER_API_URL + 'integralapp/api/itrlTies',itrlTypeDTO,{observe: 'response'});
    }

}
