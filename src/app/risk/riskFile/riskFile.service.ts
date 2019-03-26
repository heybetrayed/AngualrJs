import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../app.constants';
import {RiskFileDTO} from './riskFileDTO';
import {HttpClient, HttpResponse} from '@angular/common/http';

@Injectable()
export class RiskFileService {

    constructor(
        private http: HttpClient
    ) {

    }

    getAllFiles(data): Observable<HttpResponse<any>>{
        return this.http.post(SERVER_API_URL + 'riskapp/api/riskFilesPages',{}, {params: data, observe: 'response'});
    }

    getRiskFileById(riskFileDTO: RiskFileDTO): Observable<HttpResponse<RiskFileDTO>> {
        return this.http.post<RiskFileDTO>(SERVER_API_URL + 'riskapp/api/getRiskFileById', riskFileDTO, {observe: 'response'});
    }

    edit(riskFileDTO: RiskFileDTO): Observable<HttpResponse<RiskFileDTO>> {
        return this.http.put<RiskFileDTO>(SERVER_API_URL + 'riskapp/api/risk-files', riskFileDTO, {observe: 'response'});
    }

}
