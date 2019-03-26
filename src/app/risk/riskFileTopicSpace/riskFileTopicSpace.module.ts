import {RouterModule, Routes} from '@angular/router';
import {RiskFileTopicSpaceComponent} from './riskFileTopicSpace.component';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DataTablesModule} from 'angular-datatables';
import {CoreModule} from '../../core/core.module';
import {HttpClientModule} from '@angular/common/http';
import {SharedModule} from '../../shared/shared.module';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {ShareTopicSpaceModule} from '../shareTopicSpace/shareTopicSpace.module';

export const routes: Routes = [
    {
        path: '',
        component: RiskFileTopicSpaceComponent,
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
        RiskFileTopicSpaceComponent
    ],
    exports: [
        SharedModule,
        RouterModule
    ]
})

export class RiskFileTopicSpaceModule {

}