import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserRouteAccessService} from '../../core/auth/user-route-access-service';

import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CoreModule} from '../../core/core.module';
import {DataTablesModule} from 'angular-datatables';
import {SharedModule} from '../../shared/shared.module';
import {RiskTempConfigComponent} from './riskTempConfig.component';
import {RiskTempConfigService} from './riskTempConfig.service';
import {NgZorroAntdModule} from 'ng-zorro-antd';

export const routes: Routes = [
    {
        path: '',
        component: RiskTempConfigComponent,
        data: {
            authorities: ['ROLE_USER','ROLE_ADMIN'],
            pageTitle: '风险模板维护'
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
        RouterModule.forChild(routes)
    ],
    declarations: [
        RiskTempConfigComponent,
    ],
    exports: [
        SharedModule,
        RouterModule
    ],
    bootstrap: [RiskTempConfigComponent],
    providers: [
        RiskTempConfigService
    ]
})

export class RiskTempConfigModule {
}
