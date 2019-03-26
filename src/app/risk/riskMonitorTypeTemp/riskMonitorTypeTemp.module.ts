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
import {RiskMonitorTypeTempComponent} from './riskMonitorTypeTemp.component';
import {RiskMonitorTypeTempService} from './riskMonitorTypeTemp.service';
import {UserRouteAccessService} from '../../core/auth/user-route-access-service';


export const routes: Routes = [
    {
        path: '',
        component: RiskMonitorTypeTempComponent,
        data: {
            authorities: ['ROLE_USER','ROLE_ADMIN'],
            pageTitle: '监控类型维护'
        },
        canActivate:[UserRouteAccessService]
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
        RiskMonitorTypeTempComponent
    ],
    exports: [
        SharedModule,
        RouterModule
    ],
    providers:[
        RiskMonitorTypeTempService,
    ]
})



export class RiskMonitorTypeTempModule {

}
