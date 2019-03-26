import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../app.constants';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {RiskRegTaskDTO} from '../riskRegTask/riskRegTaskDTO';
import {RiskNewsDTO} from './riskNewsDTO';

@Injectable()
export class RiskNewsService {

    constructor(
        private http: HttpClient
    ) {

    }

    // 获取新闻列表
    listAllNews(riskNewsDTO: RiskNewsDTO, data, req?: any): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + 'riskapp/api/news-page', riskNewsDTO, {params: data, observe: 'response'});
    }

    // 根据ID获取新闻
    getNewsById(id: string): Observable<HttpResponse<RiskNewsDTO>> {
        return this.http.get<RiskNewsDTO>(SERVER_API_URL + 'riskapp/api/news/' + id, {observe: 'response'});
    }

    // 增加新闻
    saveNews(riskNewsDTO: RiskNewsDTO): Observable<HttpResponse<any>> {
        return this.http.post<RiskRegTaskDTO>(SERVER_API_URL + 'riskapp/api/news', riskNewsDTO, {observe: 'response'});
    }

    // 删除新闻
    deleteNewsById(id: string) {
        return this.http.delete(SERVER_API_URL + 'riskapp/api/listDocumentsByTaskId/' + id, {observe: 'response'});
    }

    // 更新新闻
    updateNews(riskNewsDTO: RiskNewsDTO): Observable<HttpResponse<RiskNewsDTO>> {
        return this.http.put<RiskNewsDTO>(SERVER_API_URL + 'riskapp/api/news', riskNewsDTO, {observe: 'response'});
    }

}
