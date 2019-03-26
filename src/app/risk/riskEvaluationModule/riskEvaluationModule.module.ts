import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CoreModule} from "../../core/core.module";
import {SharedModule} from "../../shared/shared.module";
import {WebofficeModule} from "../../shared/weboffice/weboffice.module";
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {UploaderModule} from '../../shared/uploader/uploader.module';
import {RiskEvaluationModuleService} from './riskEvaluationModule.service';
import {RiskEvaluationModuleComponent} from './riskEvaluationModule.component';


export const routes: Routes = [
    {
        path: '',
        component: RiskEvaluationModuleComponent,
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
        RiskEvaluationModuleComponent
    ],
    exports: [
        SharedModule,
        RouterModule
    ],
    providers:[RiskEvaluationModuleService]
})

export class RiskEvaluationModuleModule {
}
