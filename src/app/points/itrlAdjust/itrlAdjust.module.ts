import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ItrlAdjustComponent} from './itrlAdjust.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DataTablesModule} from 'angular-datatables';
import {ItrlAdjustService} from './itrlAdjust.service';
import {SharedModule} from '../../shared/shared.module';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {CoreModule} from '../../core/core.module';
import {UserService} from '../../gateway/user/user.service';
import {jqxBarGaugeComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxbargauge';

export const routes: Routes = [
    {
        path: '',
        component: ItrlAdjustComponent,
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
        ItrlAdjustComponent,
        jqxBarGaugeComponent
    ],
    exports: [
        SharedModule,
        RouterModule
    ],
    providers:[
        ItrlAdjustService,
        UserService
    ]
})
export class ItrlAdjustModule { }
