import {Injectable} from '@angular/core';
import {SearchresultsDto} from './searchresults-dto';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../app.constants';
import {HttpClient, HttpResponse} from '@angular/common/http';


@Injectable()
export class SearchresultsService{
    constructor(
        private http: HttpClient
    ) {

    }

    edit(ssDto: SearchresultsDto): Observable<HttpResponse<SearchresultsDto>> {
        return this.http.put<SearchresultsDto>(SERVER_API_URL + 'systemoperation/api/updateSearchResults', ssDto,{observe: 'response'});
    }

    getOne(id): Observable<HttpResponse<SearchresultsDto>>{
        return this.http.get<SearchresultsDto>(SERVER_API_URL + 'systemoperation/api/search-results/'+id,{observe: 'response'});
    }

}