import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {CommonModule} from "@angular/common";
import {UserRouteAccessService} from "../../core/auth/user-route-access-service";
import {DataTablesModule} from "angular-datatables";
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../shared/shared.module";
import {SessionComponent} from './session.component';
import {SessionService} from './session.service';

export const routes: Routes = [
    {
        path: '',
        component: SessionComponent,
        data: {
            authorities: ['ROLE_USER','ROLE_ADMIN'],
            pageTitle: '会话管理'
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
        SessionComponent,
        // EqualValidator
    ],
    exports: [
        SharedModule,
        RouterModule
    ],
 providers:[
     SessionService
 ]
})
export class SessionModule { }


