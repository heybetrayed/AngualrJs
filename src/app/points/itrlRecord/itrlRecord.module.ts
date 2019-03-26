import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {DataTablesModule} from "angular-datatables";
import {UserRouteAccessService} from '../../core/auth/user-route-access-service';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CoreModule} from "../../core/core.module";
import {SharedModule} from "../../shared/shared.module";
import {HttpClientModule} from "@angular/common/http";
import {ItrlRecordComponent} from './itrlRecord.component';
import {ItrlRecordService} from './itrlRecord.service';


export const routes: Routes = [
    {
        path: '',
        component: ItrlRecordComponent,
        data: {
            authorities: ['ROLE_USER','ROLE_ADMIN'],
            pageTitle: '客户积分详情'
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
        DataTablesModule, CoreModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        ItrlRecordComponent,
    ],
    exports: [
        SharedModule,
        RouterModule
    ],
    providers: [
        ItrlRecordService
    ]
})
export class ItrlRecordModule { }

