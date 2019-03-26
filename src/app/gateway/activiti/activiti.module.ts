import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CommonModule} from '@angular/common';
import {UserRouteAccessService} from '../../core/auth/user-route-access-service';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {ActivitiComponent} from './activiti.component';
import {ActivitiService} from './activiti.service';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {RandomUserService} from '../../cleanui/tables/ant-tables.page';
import {ModelerModule} from '../../shared/modeler/modeler.module';

export const routes: Routes = [
    {
        path: '',
        component: ActivitiComponent,
        data: {
            authorities: ['ROLE_ADMIN', 'ROLE_USER'],
            pageTitle: '流程管理'
        },
        canActivate: [UserRouteAccessService]
    }
];

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        ModelerModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        ActivitiComponent,
    ],
    exports: [
        SharedModule,
        RouterModule
    ],
    providers: [
        ActivitiService,
        RandomUserService
    ]
})
export class ActivitiModule {
}


