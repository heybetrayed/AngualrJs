import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {SwaggerComponent} from "./swagger.component";
import {UserRouteAccessService} from "../../core/auth/user-route-access-service";

export const routes: Routes = [
    {
        path: '',
        component: SwaggerComponent,
        data: {
            authorities: ['ROLE_USER','ROLE_ADMIN'],
            pageTitle: 'swagger'
        },
        canActivate:[UserRouteAccessService]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    declarations: [
        SwaggerComponent,
    ],
    exports: [
        RouterModule
    ]
})
export class SwaggerModule { }
