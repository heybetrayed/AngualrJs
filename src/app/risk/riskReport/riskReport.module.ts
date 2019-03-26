import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserRouteAccessService} from '../../core/auth/user-route-access-service';
import {RiskReportComponent} from "./riskReport.component";
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CoreModule} from "../../core/core.module";
import {SharedModule} from "../../shared/shared.module";
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {RiskReportListComponent} from './riskReportList/riskReportList.component';
import {RiskReportService} from './riskReport.service';
import { UEditorModule } from 'ngx-ueditor';
import {ModelerModule} from '../../shared/modeler/modeler.module';
import {ActivitiService} from '../../gateway/activiti/activiti.service';

export const routes: Routes = [
    {
        path: '',
        component: RiskReportComponent,
        data: {
            authorities: ['ROLE_USER','ROLE_ADMIN'],
            pageTitle: '工作台'
        },
        canActivate:[UserRouteAccessService]
    }
];

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        NgZorroAntdModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        ModelerModule,
        RouterModule.forChild(routes),
        UEditorModule.forRoot({
            js: [
                `./assets/ueditor/ueditor.all.js`,
                `./assets/ueditor/ueditor.config.js`,
            ],
            // 默认前端配置项
            options: {
                UEDITOR_HOME_URL: './assets/ueditor/'
            }
        }),
    ],
    declarations: [
        RiskReportComponent,
    ],
    exports: [
        SharedModule,
        RouterModule
    ],
    providers: [
        RiskReportService,
        ActivitiService
    ]
})

export class RiskReportModule {
}
