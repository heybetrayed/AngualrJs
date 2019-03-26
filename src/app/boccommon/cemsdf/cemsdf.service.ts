import { Injectable } from '@angular/core';
import {SERVER_API_URL} from '../../app.constants';
import {Observable} from 'rxjs/Observable';
import {createRequestOption} from '../../core/http/request-util';
import {HttpClient, HttpResponse} from '@angular/common/http';

@Injectable()
export class CemsdfService {

    constructor(private http: HttpClient) {

    }

    getCemSdfs(req?: any): Observable<HttpResponse<any>>{
        const options = createRequestOption(req);
        return this.http.get(SERVER_API_URL + 'boccommon/api/cemsdfs',{params: options, observe: 'response'});
    }

}
