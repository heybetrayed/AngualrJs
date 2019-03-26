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
import {RiskEvaluationTypeComponent} from './riskEvaluationType.component';
import {RiskEvaluationTypeService} from './riskEvaluationType.service';


export const routes: Routes = [
    {
        path: '',
        component: RiskEvaluationTypeComponent,
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
        RiskEvaluationTypeComponent
    ],
    exports: [
        SharedModule,
        RouterModule
    ],
    providers:[RiskEvaluationTypeService]
})

export class RiskEvaluationTypeModule {
}
