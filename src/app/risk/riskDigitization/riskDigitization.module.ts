import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserRouteAccessService} from '../../core/auth/user-route-access-service';
import {RiskDigitizationComponent} from './riskDigitization.component';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CoreModule} from '../../core/core.module';
import {DataTablesModule} from 'angular-datatables';
import {SharedModule} from '../../shared/shared.module';
import {RiskDigitizationService} from './riskDigitization.service';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {RiskTaskService} from '../riskTask/riskTask.service';
import {OrganizationService} from "../../gateway/organization/organization.service";
import {ActivitiService} from '../../gateway/activiti/activiti.service';
import {ModelerModule} from '../../shared/modeler/modeler.module';

export const routes: Routes = [
    {
        path: '',
        component: RiskDigitizationComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: '工作台'
        },
        canActivate: [UserRouteAccessService]
    }
];

@NgModule({
    imports: [
        NgZorroAntdModule,
        CommonModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTablesModule,
        CoreModule,
        ModelerModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        // FormComponent,
        RiskDigitizationComponent
    ],
    exports: [
        SharedModule,
        RouterModule,
    ],
    providers: [
        RiskDigitizationService,
        RiskTaskService,
        OrganizationService,
        ActivitiService
    ]
})

export class RiskDigitizationModule {
}
