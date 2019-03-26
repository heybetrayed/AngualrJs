import {NgModule} from '@angular/core';
import {UserRouteAccessService} from "../../core/auth/user-route-access-service";
import {RouterModule, Routes} from "@angular/router";
import {CommonModule} from "@angular/common";
import {CommonboardComponent} from './commonboard.component';
import {SharedModule} from '../../shared/shared.module';

export const routes: Routes = [
    {
        path: '',
        component: CommonboardComponent,
        data: {
            authorities: ['ROLE_USER','ROLE_ADMIN'],
            pageTitle: '共通'
        },
        canActivate:[UserRouteAccessService]
    }
];


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        CommonboardComponent,
    ],
    exports: [
        SharedModule,
        RouterModule
    ]
})

export class CommonboardModule {

}


