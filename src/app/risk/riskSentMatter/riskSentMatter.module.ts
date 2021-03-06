import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserRouteAccessService} from '../../core/auth/user-route-access-service';
import {RiskSentMatterComponent} from "./riskSentMatter.component";
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CoreModule} from "../../core/core.module";
import {DataTablesModule} from "angular-datatables";
import {SharedModule} from "../../shared/shared.module";
import {NgZorroAntdModule} from 'ng-zorro-antd';

export const routes: Routes = [
    {
        path: '',
        component: RiskSentMatterComponent,
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
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTablesModule,
        CoreModule,
        NgZorroAntdModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        RiskSentMatterComponent,
    ],
    exports: [
        SharedModule,
        RouterModule
    ]
})

export class RiskSentMatterModule {
}
