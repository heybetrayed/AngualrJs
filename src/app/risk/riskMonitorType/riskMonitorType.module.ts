import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DataTablesModule} from 'angular-datatables';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CoreModule} from '../../core/core.module';
import {SharedModule} from '../../shared/shared.module';
import {WebofficeModule} from '../../shared/weboffice/weboffice.module';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {UploaderModule} from '../../shared/uploader/uploader.module';
import {RiskMonitorTypeComponent} from './riskMonitorType.component';
import {RiskMonitorTypeService} from './riskMonitorType.service';
import {RiskDocumentsService} from '../riskDocuments/riskDocuments.service';
import {OrganizationService} from '../../gateway/organization/organization.service';
import {UEditorModule} from 'ngx-ueditor';
import {UserRouteAccessService} from '../../core/auth/user-route-access-service';


export const routes: Routes = [
    {
        path: '',
        component: RiskMonitorTypeComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: '监控类型维护'
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
        CoreModule,
        UploaderModule,
        DataTablesModule,
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
        RiskMonitorTypeComponent
    ],
    exports: [
        SharedModule,
        RouterModule
    ],
    providers: [
        RiskMonitorTypeService,
        RiskDocumentsService,
        OrganizationService
    ]
})

export class RiskMonitorTypeModule {
}
