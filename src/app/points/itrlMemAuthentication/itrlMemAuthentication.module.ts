import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ItrlMemAuthenticationComponent} from './itrlMemAuthentication.component';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ItrlMemAuthenticationService} from './itrlMemAuthentication.service';
import {UserRouteAccessService} from '../../core/auth/user-route-access-service';

export const routes: Routes = [
    {
        path: '',
        component: ItrlMemAuthenticationComponent,
        data: {
            authorities: ['ROLE_USER','ROLE_ADMIN'],
            pageTitle: ''
        },
        canActivate:[UserRouteAccessService]
    }
];


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes)
    ],
    declarations:[
        ItrlMemAuthenticationComponent
    ],
    exports: [
        RouterModule
    ],
    providers:[ItrlMemAuthenticationService]
})
export class ItrlMemAuthenticationModule { }