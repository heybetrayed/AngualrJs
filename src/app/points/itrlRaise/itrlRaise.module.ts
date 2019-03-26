import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ItrlRaiseComponent} from './itrlRaise.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DataTablesModule} from 'angular-datatables';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {CoreModule} from '../../core/core.module';
import {SharedModule} from '../../shared/shared.module';
import {ItrlRaiseService} from './itrlRaise.service';
import {ItrlLimitService} from '../itrlLimit/itrlLimit.service';
import {ItrlMemService} from '../itrlMem/itrlMem.service';
import {ItrlChangeService} from '../itrlChange/itrlChange.service';
import {UserRouteAccessService} from '../../core/auth/user-route-access-service';

export const routes: Routes = [
    {
        path: '',
        component: ItrlRaiseComponent,
        data: {
            authorities: ['ROLE_USER','ROLE_ADMIN'],
            pageTitle: '积分增加'
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
        ItrlRaiseComponent
    ],
    exports: [
        SharedModule,
        RouterModule
    ],
    providers:[
        ItrlRaiseService,
        ItrlLimitService,
        ItrlChangeService,
        ItrlMemService
    ]
})
export class ItrlRaiseModule { }
