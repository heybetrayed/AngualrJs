import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class RiskSentMatterService {

    constructor(
        private http: HttpClient
    ) {

    }

}
