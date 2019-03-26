import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {UserRouteAccessService} from '../../core/auth/user-route-access-service';
import {EmailboardComponent} from './emailboard.component';

export const routes: Routes = [
    {
        path: '',
        component: EmailboardComponent,
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
        EmailboardComponent,
    ],
    exports: [
        RouterModule
    ]
})

export class EmailboardModule {
}
