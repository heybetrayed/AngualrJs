import {RouterModule, Routes} from '@angular/router';
import {RiskEvaluationRelationComponent} from './riskEvaluationRelation.component';
import {NgModule} from '@angular/core';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {CoreModule} from '../../core/core.module';
import {SharedModule} from '../../shared/shared.module';
import {RiskEvaluationRelationService} from './riskEvaluationRelation.service';

export const routes: Routes = [
    {
        path: '',
        component: RiskEvaluationRelationComponent,
        data: {
            authorites: ['ROLE_USER', 'ROLE_ADMIN'],
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
        RouterModule.forChild(routes)
    ],
    declarations: [
        RiskEvaluationRelationComponent
    ],
    exports: [
        SharedModule,
        RouterModule
    ],
    providers: [
        RiskEvaluationRelationService
    ]
})

export class RiskEvaluationRelationModule {
}