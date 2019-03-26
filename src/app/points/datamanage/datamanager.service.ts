import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../app.constants';
import {DditDto} from './ddit-dto';
import {HttpClient, HttpResponse} from '@angular/common/http';

@Injectable()
export class DatamanagerService {

    constructor(
        private http: HttpClient
    ) {

    }

    get(id): Observable<HttpResponse<DditDto>> {
        return this.http.get<DditDto>(SERVER_API_URL + 'integralapp/api/ddits/' + id, {observe: 'response'});
    }

    getAllDdits(): Observable<HttpResponse<DditDto[]>> {
        return this.http.get<DditDto[]>(SERVER_API_URL + 'integralapp/api/getAllDdits', {observe: 'response'});
    }

    create(dditDto: DditDto): Observable<HttpResponse<DditDto>> {
        return this.http.post<DditDto>(SERVER_API_URL + 'integralapp/api/ddits', dditDto, {observe: 'response'});
    }

    edit(dditDto: DditDto): Observable<HttpResponse<DditDto>> {
        return this.http.put<DditDto>(SERVER_API_URL + 'integralapp/api/ddits', dditDto, {observe: 'response'});
    }

    delete(id: number): Observable<HttpResponse<DditDto>> {
        return this.http.post<DditDto>(SERVER_API_URL + 'integralapp/api/ddits', id, {observe: 'response'});
    }

    checkDditCode(dditDto: DditDto): Observable<HttpResponse<boolean>> {
        return this.http.post<boolean>(SERVER_API_URL + 'integralapp/api/checkDditCode', dditDto, {observe: 'response'});
    }
}
