import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ConfparameterComponent} from './confparameter.component';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {UserRouteAccessService} from '../../core/auth/user-route-access-service';
import {DataTablesModule} from 'angular-datatables';
import {SharedModule} from '../../shared/shared.module';
import {CoreModule} from '../../core/core.module';
import {ConfparameterService} from './confparameter.service';
export const routes: Routes = [
    {
        path: '',
        component: ConfparameterComponent,
        data: {
            authorities: ['ROLE_USER','ROLE_ADMIN'],
            pageTitle: '24小时维护'
        },
        canActivate:[UserRouteAccessService]
    }
];


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DataTablesModule,CoreModule,
        RouterModule.forChild(routes)
    ],
    declarations:[
        ConfparameterComponent
    ],
    exports: [
        RouterModule
        ,SharedModule
    ],
    providers:[ConfparameterService]
})
export class ConfparameterModule { }