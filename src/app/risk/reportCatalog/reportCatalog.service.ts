import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../app.constants';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {ReportCatalogDTO} from './reportCatalogDTO';
import {NzTreeNode} from 'ng-zorro-antd';

@Injectable()
export class ReportCatalogService {

    constructor(
        private http: HttpClient
    ) {

    }

    // 分页框架目录
    listAllReportCatalog(reportCatalogDTO: ReportCatalogDTO, data, req?: any): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + 'riskapp/api/report-catalog-pages', reportCatalogDTO, {params: data, observe: 'response'});
    }

    saveReportDetail(catalogId,nzTreeNode: string) {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.post(SERVER_API_URL + 'riskapp/api/report-catalogs-detail/'+catalogId, nzTreeNode, {headers, observe: 'response'});
    }


    // 根据框架ID获取框架目录
    getReportCatalogDetailById(reportCatalogDTO: ReportCatalogDTO):Observable<HttpResponse<any>> {
        return this.http.get(SERVER_API_URL + 'riskapp/api/getReportCatalogDetailById/'+reportCatalogDTO.id,{observe: 'response'});
    }

    savaReportCatalog(reportCatalogDTO: ReportCatalogDTO): Observable<HttpResponse<ReportCatalogDTO>> {
        return this.http.post<ReportCatalogDTO>(SERVER_API_URL + 'riskapp/api/savaReportCatalog', reportCatalogDTO, {observe: 'response'});
    }


}
