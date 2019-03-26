import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {SERVER_API_URL} from '../../app.constants';
import {RiskTempDTO} from './riskTempDTO';
import {HttpClient, HttpResponse} from '@angular/common/http';

@Injectable()
export class RiskTempService {

    constructor(private http: HttpClient) {

    }

    //根据ID查询目录
    getRiskTemp(riskTempId): Observable<HttpResponse<any>>{
        return this.http.get(SERVER_API_URL + 'riskapp/api/getRiskTemp/'+riskTempId,{observe: 'response'});
    }

    //新建模板
    createRiskTemp(riskTempDTO: RiskTempDTO): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + 'riskapp/api/createRiskTemp', riskTempDTO,{observe: 'response'});
    }

    //更新模板
    updateRiskTemp(riskTempDTO: RiskTempDTO): Observable<HttpResponse<any>> {
        return this.http.put(SERVER_API_URL + 'riskapp/api/updateRiskTemp', riskTempDTO,{observe: 'response'});
    }

}
