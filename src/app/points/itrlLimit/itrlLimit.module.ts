import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DataTablesModule} from 'angular-datatables';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {CoreModule} from '../../core/core.module';
import {SharedModule} from '../../shared/shared.module';
import {ItrlLimitService} from './itrlLimit.service';
import {DataItemManagerService} from '../dataItemManage/dataItemManager.service';
import {ItrlLimitComponent} from './itrlLimit.component';

export const routes: Routes = [
    {
        path: '',
        component: ItrlLimitComponent,
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
        ItrlLimitComponent,
    ],
    exports: [
        SharedModule,
        RouterModule
    ],
    providers:[
        ItrlLimitService,
        DataItemManagerService
    ]
})
export class ItrlLimitModule { }
