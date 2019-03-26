import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserRouteAccessService} from '../../core/auth/user-route-access-service';
import {RiskTempComponent} from "./riskTemp.component";
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CoreModule} from "../../core/core.module";
import {DataTablesModule} from "angular-datatables";
import {SharedModule} from "../../shared/shared.module";
import {RiskTempService} from './riskTemp.service';
import {TreeModule} from '../../../assets/modules/jqx/tree.module';

export const routes: Routes = [
    {
        path: '',
        component: RiskTempComponent,
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
        DataTablesModule, CoreModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        RiskTempComponent,
    ],
    exports: [
        SharedModule,
        RouterModule
    ],
    bootstrap: [RiskTempComponent],
    providers: [
        RiskTempService
    ]
})

export class RiskTempModule {
}
