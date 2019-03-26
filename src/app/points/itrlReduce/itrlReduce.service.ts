import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../app.constants';
import {ItrlReduceDto} from './itrlReduce-dto';
import {HttpClient, HttpResponse} from '@angular/common/http';


@Injectable()
export class ItrlReduceService {

    constructor(
      private http: HttpClient
    ) {

    }
    reduceItrl(itrlReduceDto:ItrlReduceDto): Observable<HttpResponse<ItrlReduceDto>> {
        return this.http.post<ItrlReduceDto>(SERVER_API_URL + 'integralapp/api/itrlReduce',itrlReduceDto,{observe: 'response'});
    }

}
