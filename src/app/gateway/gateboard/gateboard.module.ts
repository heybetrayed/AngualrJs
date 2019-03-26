import {NgModule} from '@angular/core';
import {UserRouteAccessService} from "../../core/auth/user-route-access-service";
import {RouterModule, Routes} from "@angular/router";
import {GateboardComponent} from "./gateboard.component";
import {CommonModule} from "@angular/common";

export const routes: Routes = [
    {
        path: '',
        component: GateboardComponent,
        data: {
            authorities: ['ROLE_USER','ROLE_ADMIN'],
            pageTitle: '网关'
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
        GateboardComponent,
    ],
    exports: [
        RouterModule
    ]
})

export class GateboardModule {

}


