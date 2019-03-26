import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserRouteAccessService} from '../../core/auth/user-route-access-service';
import {SharedModule} from '../../shared/shared.module';
import {TreePermissionComponent} from './treePermission.component';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {TreeModule} from '../../../assets/modules/jqx/tree.module';
import {CheckBoxModule} from '../../../assets/modules/jqx/checkbox.module';
import {TreePermissionService} from './treePermission.service';

export const routes: Routes = [
    {
        path: '',
        component: TreePermissionComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: '会话管理'
        },
        canActivate: [UserRouteAccessService]
    }
];

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TreeModule,
        CheckBoxModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        TreePermissionComponent,
    ],
    exports: [
        SharedModule,
        RouterModule
    ],
    bootstrap: [TreePermissionComponent],
    providers: [
        TreePermissionService
    ]
})
export class TreePermissionModule {}


