import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {UserRouteAccessService} from '../../core/auth/user-route-access-service';
import {DataTablesModule} from 'angular-datatables';
import {SharedModule} from '../../shared/shared.module';
import {CoreModule} from '../../core/core.module';
import {SearchresultsComponent} from './searchresults.component';
import {SearchresultsService} from './searchresults.service';
export const routes: Routes = [
    {
        path: '',
        component: SearchresultsComponent,
        data: {
            authorities: ['ROLE_USER','ROLE_ADMIN'],
            pageTitle: '检索结果'
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
        SearchresultsComponent
    ],
    exports: [
        RouterModule
        ,SharedModule
    ],
    providers:[SearchresultsService]
})
export class SearchresultsModule { }