import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserRouteAccessService} from '../../core/auth/user-route-access-service';

import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CoreModule} from "../../core/core.module";
import {DataTablesModule} from "angular-datatables";
import {SharedModule} from "../../shared/shared.module";
import {RiskTaskComponent} from './riskTask.component';
import {RiskTaskService} from './riskTask.service';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import { UEditorModule } from 'ngx-ueditor';
import {RiskReportService} from '../riskReport/riskReport.service';
import {RiskDocumentsService} from '../riskDocuments/riskDocuments.service';
import {WebofficeModule} from '../../shared/weboffice/weboffice.module';
import {FileUploadModule} from 'ng2-file-upload';

export const routes: Routes = [
    {
        path: '',
        component: RiskTaskComponent,
        data: {
            authorities: ['ROLE_USER','ROLE_ADMIN'],
            pageTitle: '发布任务'
        },
        canActivate:[UserRouteAccessService]
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        DataTablesModule, CoreModule,
        WebofficeModule,
        RouterModule.forChild(routes),
        UEditorModule.forRoot({
            js: [
                `./assets/ueditor/ueditor.all.min.js`,
                `./assets/ueditor/ueditor.config.js`,
            ],
            // 默认前端配置项
            options: {
                UEDITOR_HOME_URL: './assets/ueditor/'
            }
        }),
    ],
    declarations: [
        RiskTaskComponent,
    ],
    exports: [
        SharedModule,
        RouterModule
    ],
    bootstrap: [RiskTaskComponent],
    providers: [
        RiskTaskService,
        RiskReportService,
        RiskDocumentsService
    ]
})

export class RiskTaskModule {
}
