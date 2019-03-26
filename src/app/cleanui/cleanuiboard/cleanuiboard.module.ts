import {NgModule} from '@angular/core';
import {UserRouteAccessService} from "../../core/auth/user-route-access-service";
import {RouterModule, Routes} from "@angular/router";
import {CommonModule} from "@angular/common";
import {SharedModule} from '../../shared/shared.module';
import {CleanuiboardComponent} from './cleanuiboard.component';

export const routes: Routes = [
    {
        path: '',
        component: CleanuiboardComponent,
        data: {
            authorities: ['ROLE_USER','ROLE_ADMIN'],
            pageTitle: 'CleanUI'
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
        CleanuiboardComponent,
    ],
    exports: [
        SharedModule,
        RouterModule
    ]
})

export class CleanuiboardModule {

}


