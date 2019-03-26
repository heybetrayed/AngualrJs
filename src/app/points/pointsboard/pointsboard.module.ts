import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {UserRouteAccessService} from '../../core/auth/user-route-access-service';
import {PointsboardPage} from './pointsboard.page';

export const routes: Routes = [
    {
        path: '',
        component: PointsboardPage,
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
        PointsboardPage,
    ],
    exports: [
        RouterModule
    ]
})

export class PointsboardModule {
}
