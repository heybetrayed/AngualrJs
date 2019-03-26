import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ItrlChangeService} from './itrlChange.service';
import {ItrlLimitService} from '../itrlLimit/itrlLimit.service';
import {ItrlChangeComponent} from './itrlChange.component';
import {DataTablesModule} from 'angular-datatables';
import {CoreModule} from '../../core/core.module';
import {SharedModule} from '../../shared/shared.module';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {UserRouteAccessService} from '../../core/auth/user-route-access-service';
import {CemsdfService} from '../../boccommon/cemsdf/cemsdf.service';

export const routes: Routes = [
    {
        path: '',
        component: ItrlChangeComponent,
        data: {
            authorities: ['ROLE_USER','ROLE_ADMIN'],
            pageTitle: '积分变动规则'
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
    declarations: [
        ItrlChangeComponent
    ],
    exports: [
        SharedModule,
        RouterModule
    ],
    providers:[ItrlChangeService,ItrlLimitService,CemsdfService]
})
export class ItrlChangeModule { }
