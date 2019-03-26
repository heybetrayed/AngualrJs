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
import {RiskRegTaskComponent} from './riskRegTask.component';
import {RiskRegTaskService} from './riskRegTask.service';

import {registerLocaleData} from '@angular/common';
import zh from '@angular/common/locales/zh';
import {RiskDocumentsService} from '../riskDocuments/riskDocuments.service';

registerLocaleData(zh);


export const routes: Routes = [
    {
        path: '',
        component: RiskRegTaskComponent,
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
        CoreModule,
        UploaderModule,
        WebofficeModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        RiskRegTaskComponent
    ],
    exports: [
        SharedModule,
        RouterModule
    ],
    providers: [
        RiskRegTaskService,
        RiskDocumentsService
    ]
})

export class RiskRegTaskModule {
}
