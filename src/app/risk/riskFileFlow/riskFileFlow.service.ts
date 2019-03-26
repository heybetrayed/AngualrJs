import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../app.constants';
import {RiskFileTaskDTO} from './riskFileTaskDTO';
import {RiskFiItDTO} from '../riskFile/riskFiItDTO';
import {RiskFileDTO} from '../riskFile/riskFileDTO';
import {RiskFileTaskExtensionDTO} from './riskFileTaskExtensionDTO';
import {HttpClient, HttpResponse} from '@angular/common/http';

@Injectable()
export class RiskFileFlowService {

    constructor(
        private http: HttpClient
    ) {
    }

    createRiskFileTaskDTO(riskFileTaskDTO: RiskFileTaskDTO): Observable<HttpResponse<RiskFileTaskDTO>> {
        return this.http.post<RiskFileTaskDTO>(SERVER_API_URL + 'riskapp/api/risk-file-tasks', riskFileTaskDTO, {observe: 'response'});
    }

    createRiskFiItDTO(riskFiDTO: RiskFiItDTO): Observable<HttpResponse<RiskFileTaskDTO>> {
        return this.http.post<RiskFileTaskDTO>(SERVER_API_URL + 'riskapp/api/risk-fi-its', riskFiDTO, {observe: 'response'});
    }

    createRiskFileDTO(riskFileDTO: RiskFileDTO): Observable<HttpResponse<RiskFileTaskDTO>> {
        return this.http.post<RiskFileTaskDTO>(SERVER_API_URL + 'riskapp/api/risk-files', riskFileDTO, {observe: 'response'});
    }

    createRiskFileTaskExtensionDTO(riskFileTaskExtensionDTO: RiskFileTaskExtensionDTO): Observable<HttpResponse<RiskFileTaskDTO>> {
        return this.http.post<RiskFileTaskDTO>(SERVER_API_URL + 'riskapp/api/createRiskFileTaskExtensionDTO', riskFileTaskExtensionDTO, {observe: 'response'});
    }

}
