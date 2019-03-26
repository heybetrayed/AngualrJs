import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CoreModule} from '../../core/core.module';
import {SharedModule} from '../../shared/shared.module';
import {WebofficeModule} from '../../shared/weboffice/weboffice.module';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {UploaderModule} from '../../shared/uploader/uploader.module';
import {RiskEvaluationFactorComponent} from './riskEvaluationFactor.component';
import {RiskEvaluationFactorService} from './riskEvaluationFactor.service';
import {OrganizationService} from '../../gateway/organization/organization.service';


export const routes: Routes = [
    {
        path: '',
        component: RiskEvaluationFactorComponent,
        data: {
            authorities: ['ROLE_USER','ROLE_ADMIN'],
            pageTitle: '工作台'
        }
    }
];

@NgModule({
    imports: [
        NgZorroAntdModule,
        CommonModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        CoreModule,
        UploaderModule,
        WebofficeModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        RiskEvaluationFactorComponent
    ],
    exports: [
        SharedModule,
        RouterModule
    ],
    providers: [
        RiskEvaluationFactorService,
        OrganizationService
    ]
})

export class RiskEvaluationFactorModule {
}
