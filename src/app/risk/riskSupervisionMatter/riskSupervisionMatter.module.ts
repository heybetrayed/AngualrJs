import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserRouteAccessService} from '../../core/auth/user-route-access-service';
import {RiskSupervisionMatterComponent} from "./riskSupervisionMatter.component";
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CoreModule} from "../../core/core.module";
import {DataTablesModule} from "angular-datatables";
import {SharedModule} from "../../shared/shared.module";

export const routes: Routes = [
    {
        path: '',
        component: RiskSupervisionMatterComponent,
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
        DataTablesModule, CoreModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        RiskSupervisionMatterComponent,
    ],
    exports: [
        SharedModule,
        RouterModule
    ]
})

export class RiskSupervisionMatterModule {
}
