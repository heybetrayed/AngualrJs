import {Injectable} from '@angular/core';
import {SERVER_API_URL} from '../../app.constants';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {OrganizationDto} from './organiztionDto';

@Injectable()
export class OrganizationService {

    constructor(
        private http: HttpClient
    ) {

    }

    create(organizationDto: OrganizationDto): Observable<HttpResponse<OrganizationDto>> {
        return this.http.post<OrganizationDto>(SERVER_API_URL + 'uaa/api/organizations', organizationDto, {observe: 'response'});
    }

    getOrganization(organizationId): Observable<HttpResponse<OrganizationDto>> {
        return this.http.get<OrganizationDto>(SERVER_API_URL + 'uaa/api/organizations/' + organizationId, {observe: 'response'});
    }

    edit(organizationDto: OrganizationDto): Observable<HttpResponse<OrganizationDto>> {
        return this.http.put<OrganizationDto>(SERVER_API_URL + 'uaa/api/organizations', organizationDto, {observe: 'response'});
    }

    getOrganizations(): Observable<any>{
        return this.http.get(SERVER_API_URL + 'uaa/api/getAllOrganization',{observe: 'response'});
    }

}
