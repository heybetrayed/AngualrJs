import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../app.constants';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {RiskDditDTO, RiskDditItemDTO} from './riskDditDTO';


@Injectable()
export class RiskDditService {

    constructor(
        private http: HttpClient
    ) {

    }


    getAllRiskDditAll(riskDditDTO: RiskDditDTO, data, req?: any): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + 'riskapp/api/getAllDditsPage', riskDditDTO, {params: data, observe: 'response'});
    }

    saveDDit(riskDditDTO: RiskDditDTO): Observable<HttpResponse<RiskDditDTO>> {
        return this.http.post<RiskDditDTO>(SERVER_API_URL + 'riskapp/api/createDdit', riskDditDTO, {observe: 'response'});
    }


    getDditById(dditId): Observable<HttpResponse<any>> {
        return this.http.get(SERVER_API_URL + 'riskapp/api/getDditById/' + dditId, {observe: 'response'});
    }

    updateDdit(riskDditDTO: RiskDditDTO): Observable<HttpResponse<RiskDditDTO>> {
        return this.http.put<RiskDditDTO>(SERVER_API_URL + 'riskapp/api/updateDdit', riskDditDTO, {observe: 'response'});
    }

    //禁用
    disable(riskDditId) {
        return this.http.delete(SERVER_API_URL + 'riskapp/api/disableDdit/' + riskDditId);
    }
    //启用
    enable(riskDditId) {
        return this.http.delete(SERVER_API_URL + 'riskapp/api/enableDdit/' + riskDditId);
    }

    //批量禁用
    disableAll(data): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + '/riskapp/api/disableAllDdits', data, {observe: 'response'});
    }



    getDditItemByDditId(dditId): Observable<HttpResponse<any>> {
        return this.http.get(SERVER_API_URL + 'riskapp/api/getDditItemByDditId/' + dditId, {observe: 'response'});
    }


    getAllRiskDditItemAll(riskDditItemDTO: RiskDditItemDTO, data, req?: any): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + 'riskapp/api/getAllDditItemsPage', riskDditItemDTO, {params: data, observe: 'response'});
    }


    saveDDitItem(riskDditItemDTO: RiskDditItemDTO): Observable<HttpResponse<RiskDditDTO>> {
        return this.http.post<RiskDditDTO>(SERVER_API_URL + 'riskapp/api/createDditItem', riskDditItemDTO, {observe: 'response'});
    }


    getDditItemById(dditItemId): Observable<HttpResponse<any>> {
        return this.http.get(SERVER_API_URL + 'riskapp/api/getDditItemById/' + dditItemId, {observe: 'response'});
    }

    updateDditItem(riskDditItemDTO: RiskDditItemDTO): Observable<HttpResponse<RiskDditDTO>> {
        return this.http.put<RiskDditDTO>(SERVER_API_URL + 'riskapp/api/updateDditItem', riskDditItemDTO, {observe: 'response'});
    }


    deleteDditItem(riskDditItemId) {
        return this.http.delete(SERVER_API_URL + 'riskapp/api/deleteDditItem/' + riskDditItemId);
    }


    deleteDditItems(data): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + '/riskapp/api/deleteDditItems', data, {observe: 'response'});
    }


    getAllDditItemByDditId(data): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + '/riskapp/api/getAllDditItemByDditId', data, {observe: 'response'});
    }

}
