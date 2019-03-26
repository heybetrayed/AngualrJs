import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DataTablesModule} from 'angular-datatables';
import {CoreModule} from '../../core/core.module';
import {HttpClientModule} from '@angular/common/http';
import {SharedModule} from '../../shared/shared.module';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {RiskDigitizationTopicSpaceComponent} from './riskDigitizationTopicSpace.component';
import {ShareTopicSpaceModule} from '../shareTopicSpace/shareTopicSpace.module';

export const routes: Routes = [
    {
        path: '',
        component: RiskDigitizationTopicSpaceComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
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
        ShareTopicSpaceModule,
        DataTablesModule,
        CoreModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        RiskDigitizationTopicSpaceComponent
    ],
    exports: [
        SharedModule,
        RouterModule
    ]
})

export class RiskDigitizationTopicSpaceModule {

}