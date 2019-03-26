import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {UserRouteAccessService} from '../../core/auth/user-route-access-service';
import {SystemboardPage} from './systemboard.page';

export const routes: Routes = [
    {
        path: '',
        component: SystemboardPage,
        data: {
            authorities: ['ROLE_USER','ROLE_ADMIN'],
            pageTitle: '工作台'
        },
        canActivate:[UserRouteAccessService]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    declarations: [
        SystemboardPage,
    ],
    exports: [
        RouterModule
    ]
})

export class SystemboardModule {
}
