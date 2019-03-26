import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ItrlMedalComponent} from './itrlMedal.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DataTablesModule} from 'angular-datatables';
import {CoreModule} from '../../core/core.module';
import {SharedModule} from '../../shared/shared.module';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {ItrlMedalService} from './itrlMedal.service';
import {UserRouteAccessService} from '../../core/auth/user-route-access-service';

export const routes: Routes = [
    {
        path: '',
        component: ItrlMedalComponent,
        data: {
            authorities: ['ROLE_USER','ROLE_ADMIN'],
            pageTitle: '勋章'
        },
        canActivate:[UserRouteAccessService]
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTablesModule,CoreModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        ItrlMedalComponent
    ],
    exports: [
        SharedModule,
        RouterModule
    ],
    providers:[
        ItrlMedalService
    ]
})
export class ItrlMedalModule { }
