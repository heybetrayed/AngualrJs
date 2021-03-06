import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserRouteAccessService} from '../../core/auth/user-route-access-service';
import {RiskTodoComponent} from './riskTodo.component';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CoreModule} from '../../core/core.module';
import {DataTablesModule} from 'angular-datatables';
import {SharedModule} from '../../shared/shared.module';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {RiskTodoService} from './riskTodo.service';
import {ActivitiService} from '../../gateway/activiti/activiti.service';
import {RiskDigitizationService} from '../riskDigitization/riskDigitization.service';
import {FlowableService} from '../flowable.service';
import {RiskReportService} from '../riskReport/riskReport.service';

export const routes: Routes = [
    {
         path: '',
        component: RiskTodoComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: '工作台'
        },
        canActivate: [UserRouteAccessService]
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTablesModule,
        CoreModule,
        NgZorroAntdModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        RiskTodoComponent,
    ],
    exports: [
        SharedModule,
        RouterModule
    ],
    providers: [
        RiskTodoService,
        ActivitiService,
        RiskDigitizationService,
        FlowableService,
        RiskReportService
    ]
})

export class RiskTodoModule {
}
