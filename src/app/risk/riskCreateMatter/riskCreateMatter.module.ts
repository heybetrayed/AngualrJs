import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserRouteAccessService} from '../../core/auth/user-route-access-service';
import {RiskCreateMatterComponent} from "./riskCreateMatter.component";
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CoreModule} from "../../core/core.module";
import {DataTablesModule} from "angular-datatables";
import {SharedModule} from "../../shared/shared.module";
import {TreeModule} from "../../../assets/modules/jqx/tree.module";
import {CheckBoxModule} from "../../../assets/modules/jqx/checkbox.module";

export const routes: Routes = [
    {
        path: '',
        component: RiskCreateMatterComponent,
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
        TreeModule,
        CheckBoxModule,
        DataTablesModule, CoreModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        RiskCreateMatterComponent,
    ],
    exports: [
        SharedModule,
        RouterModule
    ]
})

export class RiskCreateMatterModule {
}
