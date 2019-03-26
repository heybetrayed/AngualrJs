import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {CommonModule} from "@angular/common";
import {UserRouteAccessService} from "../../core/auth/user-route-access-service";
import {DataTablesModule} from "angular-datatables";
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../shared/shared.module";
import {PermissionComponent} from "./permission.component";
import {PermissionService} from "./permission.service";


export const routes: Routes = [
    {
        path: '',
        component: PermissionComponent,
        data: {
            authorities: ['ROLE_USER','ROLE_ADMIN'],
            pageTitle: '权限管理'
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
        PermissionComponent,
        // EqualValidator
    ],
    exports: [
        SharedModule,
        RouterModule
    ],
    providers:[
        PermissionService
    ]

})
export class PermissionModule { }


