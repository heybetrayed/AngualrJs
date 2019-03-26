import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SERVER_API_URL} from '../../app.constants';
import {TaskDTO} from './task-dto';

@Injectable()
export class RiskTodoService {

    constructor(
        private http: HttpClient
    ) {

    }

    // 获取待办
    listAllRiskTodo(taskDto: TaskDTO, data, req?: any) {
        return this.http.post(SERVER_API_URL + 'activitios/api/workflow/daiban', taskDto, {params: data, observe: 'response'});
    }
}
