import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {SystemComponent} from "./system.component";
import {CommonModule} from "@angular/common";
import {UserRouteAccessService} from "../../core/auth/user-route-access-service";
import { DataTablesModule } from 'angular-datatables';
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../shared/shared.module";
import {SystemService} from "./system.service";

export const routes: Routes = [
    {
        path: '',
        component: SystemComponent,
        data: {
            authorities: ['ROLE_USER','ROLE_ADMIN'],
            pageTitle: '用户管理'
        },
        canActivate:[UserRouteAccessService]
    }
];

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        DataTablesModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        SystemComponent,
        // EqualValidator
    ],
    exports: [
        SharedModule,
        RouterModule
    ],
    providers:[
        SystemService
    ]

})
export class SystemModule { }


