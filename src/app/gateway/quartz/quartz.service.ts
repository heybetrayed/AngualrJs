import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../app.constants';
import {QuartzDTO} from './quartzDTO';
import {HttpClient, HttpResponse} from '@angular/common/http';


@Injectable()
export class QuartzService {

    constructor(private http: HttpClient) {

    }

    checkJob(quartzDto: QuartzDTO): Observable<HttpResponse<QuartzDTO>> {
        return this.http.post<QuartzDTO>(SERVER_API_URL + 'quartz/api/checkJob', quartzDto,{observe: 'response'});
    }

    saveJob(quartzDto: QuartzDTO): Observable<HttpResponse<QuartzDTO>> {
        return this.http.post<QuartzDTO>(SERVER_API_URL + 'quartz/api/saveQuartz', quartzDto,{observe: 'response'});
    }

    updateJob(quartzDto: QuartzDTO): Observable<HttpResponse<QuartzDTO>> {
        return this.http.put<QuartzDTO>(SERVER_API_URL + 'quartz/api/updateQuartz', quartzDto,{observe: 'response'});
    }

    stopJob(quartzDto: QuartzDTO): Observable<HttpResponse<QuartzDTO>> {
        return this.http.put<QuartzDTO>(SERVER_API_URL + 'quartz/api/stopQuartz', quartzDto,{observe: 'response'});
    }

    recoveryJob(quartzDto: QuartzDTO): Observable<HttpResponse<QuartzDTO>> {
        return this.http.put<QuartzDTO>(SERVER_API_URL + 'quartz/api/recoveryQuartz', quartzDto,{observe: 'response'});
    }

    delJob(quartzDto: QuartzDTO): Observable<HttpResponse<QuartzDTO>> {
        return this.http.put<QuartzDTO>(SERVER_API_URL + 'quartz/api/delQuartz', quartzDto,{observe: 'response'});
    }

    runOne(quartzDto: QuartzDTO): Observable<HttpResponse<QuartzDTO>> {
        return this.http.put<QuartzDTO>(SERVER_API_URL + 'quartz/api/runOne', quartzDto,{observe: 'response'});
    }

    getOne(jobId): Observable<HttpResponse<QuartzDTO>> {
        return this.http.get<QuartzDTO>(SERVER_API_URL + 'quartz/api/getOne/' + jobId,{observe: 'response'});
    }


}
