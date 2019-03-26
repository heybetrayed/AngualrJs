import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {CommonModule} from "@angular/common";
import {UserRouteAccessService} from "../../core/auth/user-route-access-service";
import {DataTablesModule} from "angular-datatables";
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../shared/shared.module";
import {EmailConfigService} from './emailConfig.service';
import {EmailConfigComponent} from './emailConfig.component';

export const routes: Routes = [
    {
        path: '',
        component: EmailConfigComponent,
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
        EmailConfigComponent,
        // EqualValidator
    ],
    exports: [
        SharedModule,
        RouterModule
    ],
    providers:[
        EmailConfigService
    ]

})
export class EmailConfigModule { }


