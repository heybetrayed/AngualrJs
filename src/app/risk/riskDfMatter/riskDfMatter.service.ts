import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SERVER_API_URL} from '../../app.constants';
import {RiskDigitizationDTO} from '../riskDigitization/risk-digitization-dto';

@Injectable()
export class RiskDfMatterService {

    constructor(
        private http: HttpClient
    ) {

    }

    // 待发
    listAllRiskDfMatter(riskDigitizationDTO: RiskDigitizationDTO, data, req?: any) {
        return this.http.post(SERVER_API_URL + 'riskapp/api/riskDfMatter', riskDigitizationDTO, {params: data, observe: 'response'});
    }

}
