import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {RoleComponent} from "./role.component";
import {CommonModule} from "@angular/common";
import {UserRouteAccessService} from "../../core/auth/user-route-access-service";
import {DataTablesModule} from "angular-datatables";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from "../../shared/shared.module";
import {RoleService} from "./role.service";
import {CoreModule} from '../../core/core.module';
import {HttpClientModule} from '@angular/common/http';

export const routes: Routes = [
    {
        path: '',
        component: RoleComponent,
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
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTablesModule,CoreModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        RoleComponent,
        // EqualValidator
    ],
    exports: [
        SharedModule,
        RouterModule
    ],
    providers:[
        RoleService
    ]

})
export class RoleModule { }


