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


import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import {RiskDocumentsComponent} from './riskDocuments.component';
import {RiskDocumentsService} from './riskDocuments.service';
registerLocaleData(zh);


export const routes: Routes = [
    {
        path: '',
        component: RiskDocumentsComponent,
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
        DataTablesModule,
        WebofficeModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        RiskDocumentsComponent
    ],
    exports: [
        SharedModule,
        RouterModule
    ],
    providers:[RiskDocumentsService]

})

export class RiskDocumentsModule {
}
