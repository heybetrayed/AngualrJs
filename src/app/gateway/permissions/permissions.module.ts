import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {CommonModule} from "@angular/common";
import {UserRouteAccessService} from "../../core/auth/user-route-access-service";
import {DataTablesModule} from "angular-datatables";
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../shared/shared.module";
import {PermissionsComponent} from './permissions.component';
import {PermissionsService} from './permissions.service';
import {CheckBoxModule} from '../../../assets/modules/jqx/checkbox.module';
import {TreeModule} from '../../../assets/modules/jqx/tree.module';



export const routes: Routes = [
    {
        path: '',
        component: PermissionsComponent,
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
        TreeModule,
        CheckBoxModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        PermissionsComponent,
    ],
    exports: [
        SharedModule,
        RouterModule
    ],
    providers:[
        PermissionsService
    ]

})
export class PermissionsModule { }


