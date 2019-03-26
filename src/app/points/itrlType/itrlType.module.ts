import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DataTablesModule} from 'angular-datatables';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {CoreModule} from '../../core/core.module';
import {SharedModule} from '../../shared/shared.module';
import {ItrlTypeService} from './itrlType.service';
import {DataItemManagerService} from '../dataItemManage/dataItemManager.service';
import {ItrlTypeComponent} from './itrlType.component';

export const routes: Routes = [
    {
        path: '',
        component: ItrlTypeComponent,
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
        ItrlTypeComponent,
    ],
    exports: [
        SharedModule,
        RouterModule
    ],
    providers:[
        ItrlTypeService,
        DataItemManagerService
    ]
})
export class ItrlTypeModule { }
