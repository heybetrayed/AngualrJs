import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {DataTablesModule} from "angular-datatables";
import {UserRouteAccessService} from '../../core/auth/user-route-access-service';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CoreModule} from "../../core/core.module";
import {SharedModule} from "../../shared/shared.module";
import {HttpClientModule} from "@angular/common/http";
import {ItrlReduceComponent} from './itrlReduce.component';
import {ItrlReduceService} from './itrlReduce.service';
import {ItrlLimitService} from '../itrlLimit/itrlLimit.service';
import {ItrlMemService} from '../itrlMem/itrlMem.service';
import {ItrlChangeService} from '../itrlChange/itrlChange.service';


export const routes: Routes = [
    {
        path: '',
        component: ItrlReduceComponent,
        data: {
            authorities: ['ROLE_USER','ROLE_ADMIN'],
            pageTitle: '积分减少页面'
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
        ItrlReduceComponent,
    ],
    exports: [
        SharedModule,
        RouterModule
    ],
    providers: [
        ItrlReduceService,
        ItrlLimitService,
        ItrlChangeService,
        ItrlMemService
    ]
})
export class ItrlReduceModule { }

