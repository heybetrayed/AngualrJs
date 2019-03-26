import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Http, Response} from "@angular/http";
import {SERVER_API_URL} from "../../app.constants";
import {ResponseWrapper} from "../../core/http/response-wrapper.model";

@Injectable()
export class SessionService {

    constructor(
      private http: Http
    ) {

    }

    getSessions(id): Observable<ResponseWrapper>{
        return this.http.get(SERVER_API_URL + 'uaa/api/users/'+id).map((res: Response) => this.convertResponse(res));
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }
}
