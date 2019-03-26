import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {UserRouteAccessService} from '../../core/auth/user-route-access-service';
import {DataTablesModule} from 'angular-datatables';
import {SharedModule} from '../../shared/shared.module';
import {CoreModule} from '../../core/core.module';
import {ZipkinComponent} from './zipkin.component';

export const routes: Routes = [
    {
        path: '',
        component: ZipkinComponent,
        data: {
            authorities: ['ROLE_USER','ROLE_ADMIN'],
            pageTitle: '调用链查询'
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
        ZipkinComponent
    ],
    exports: [
        RouterModule
        ,SharedModule
    ],
    providers:[]
})
export class ZipkinModule { }