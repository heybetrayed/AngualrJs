import { Injectable } from '@angular/core';
import {SERVER_API_URL} from '../../app.constants';
import {Observable} from 'rxjs/Observable';
import {EmailConfigDto} from './emailConfigDto';
import {HttpClient, HttpResponse} from '@angular/common/http';
@Injectable()
export class EmailConfigService {

    constructor(
      private http: HttpClient
    ) {

    }
    getMailConfig(mailConfigId): Observable<HttpResponse<any>>{
        return this.http.get(SERVER_API_URL + 'email/api/mail-configs/'+ mailConfigId,{observe: 'response'});
    }


    create(emailConfigDto: EmailConfigDto): Observable<HttpResponse<EmailConfigDto>> {
        return this.http.post<EmailConfigDto>(SERVER_API_URL + 'email/api/mail-configs', emailConfigDto,{observe: 'response'});
    }

    edit(emailConfigDto: EmailConfigDto): Observable<HttpResponse<EmailConfigDto>> {
        return this.http.put<EmailConfigDto>(SERVER_API_URL + 'email/api/mail-configs', emailConfigDto,{observe: 'response'});
    }

}
