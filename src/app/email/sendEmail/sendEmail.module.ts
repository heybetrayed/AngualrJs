import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {CommonModule} from "@angular/common";
import {UserRouteAccessService} from "../../core/auth/user-route-access-service";
import {DataTablesModule} from "angular-datatables";
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../shared/shared.module";
import {SendEmailService} from './sendEmail.service';
import {SendEmailComponent} from './sendEmail.component';

export const routes: Routes = [
    {
        path: '',
        component: SendEmailComponent,
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
        SendEmailComponent,
        // EqualValidator
    ],
    exports: [
        SharedModule,
        RouterModule
    ],
    providers:[
        SendEmailService
    ]

})
export class SendEmailModule { }


