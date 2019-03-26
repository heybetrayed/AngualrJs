import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {DatamanageComponent} from "./datamanage.component";
import {CommonModule} from "@angular/common";
import {DataTablesModule} from "angular-datatables";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CoreModule} from "../../core/core.module";
import {SharedModule} from "../../shared/shared.module";
import {HttpClientModule} from "@angular/common/http";
import {UserRouteAccessService} from "../../core/auth/user-route-access-service";
import {DatamanagerService} from "./datamanager.service";

export const routes: Routes = [
    {
        path: '',
        component: DatamanageComponent,
        data: {
            authorities: ['ROLE_USER','ROLE_ADMIN'],
            pageTitle: '数据字典维护'
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
        DatamanageComponent
    ],
    exports: [
        SharedModule,
        RouterModule
    ],
    providers:[
        DatamanagerService
    ]
})
export class DatamanageModule { }
