import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SERVER_API_URL} from '../../app.constants';
import {TaskDTO} from '../riskTodo/task-dto';

@Injectable()
export class RiskDoneMatterService {

    constructor(
        private http: HttpClient
    ) {


    }

    // 获取已办
    listAllRiskDoneMatter(taskDTO: TaskDTO, data, req?: any) {
        return this.http.post(SERVER_API_URL + 'activitios/api/workflow/yiban', taskDTO, {params: data, observe: 'response'});
    }


}
