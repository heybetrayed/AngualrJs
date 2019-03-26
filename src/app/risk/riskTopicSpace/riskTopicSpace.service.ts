import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class RiskTopicSpaceService {

    constructor(
        private http: HttpClient
    ) {

    }

}
