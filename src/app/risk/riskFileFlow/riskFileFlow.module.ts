import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CoreModule} from '../../core/core.module';
import {SharedModule} from '../../shared/shared.module';
import {RiskFileFlowComponent} from './riskFileFlow.component';
import {FileUploadModule} from 'ng2-file-upload';
import {RiskFileFlowService} from './riskFileFlow.service';
import {UploaderModule} from '../../shared/uploader/uploader.module';
import {ModelerModule} from '../../shared/modeler/modeler.module';


export const routes: Routes = [
    {
        path: '',
        component: RiskFileFlowComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: '工作台'
        }
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        CoreModule,
        UploaderModule,
        FileUploadModule,
        ModelerModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        RiskFileFlowComponent,
    ],
    exports: [
        SharedModule,
        RouterModule
    ],
    providers: [RiskFileFlowService]
})

export class RiskFileFlowModule {
}
