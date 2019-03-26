import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserComponent} from './user.component';
import {CommonModule} from '@angular/common';
import {UserRouteAccessService} from '../../core/auth/user-route-access-service';
import {DataTablesModule} from 'angular-datatables';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {UserService} from './user.service';
import {WorkflowModule} from '../../shared/workflow/workflow.module';

export const routes: Routes = [
    {
        path: '',
        component: UserComponent,
        data: {
            authorities: ['ROLE_ADMIN', 'ROLE_USER'],
            pageTitle: '用户管理'
        },
        canActivate: [UserRouteAccessService]
    }
];

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        DataTablesModule,
        WorkflowModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        UserComponent,
        // EqualValidator
    ],
    exports: [
        SharedModule,
        RouterModule
    ],
    providers: [
        UserService
    ]
})
export class UserModule {
}


