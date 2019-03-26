import {NgModule} from '@angular/core';
import {UserRouteAccessService} from '../../core/auth/user-route-access-service';
import {RouterModule, Routes} from '@angular/router';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {CemsdfComponent} from './cemsdf.component';
import {CemsdfService} from './cemsdf.service';

export const routes: Routes = [
    {
        path: '',
        component: CemsdfComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: '共通'
        },
        canActivate: [UserRouteAccessService]
    }
];


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        CemsdfComponent,
    ],
    providers: [
        CemsdfService
    ],
    exports: [
        SharedModule,
        RouterModule
    ]
})

export class CemsdfModule {

}


