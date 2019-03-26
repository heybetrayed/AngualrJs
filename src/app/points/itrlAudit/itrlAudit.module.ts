import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DataTablesModule} from 'angular-datatables';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {CoreModule} from '../../core/core.module';
import {SharedModule} from '../../shared/shared.module';
import {ItrlAuditService} from './itrlAudit.service';
import {DataItemManagerService} from '../dataItemManage/dataItemManager.service';
import {ItrlAuditComponent} from './itrlAudit.component';
import {UserService} from '../../gateway/user/user.service';

export const routes: Routes = [
    {
        path: '',
        component: ItrlAuditComponent,
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
        ItrlAuditComponent,
    ],
    exports: [
        SharedModule,
        RouterModule
    ],
    providers:[
        ItrlAuditService,
        UserService,
        DataItemManagerService
    ]
})
export class ItrlAuditModule { }
