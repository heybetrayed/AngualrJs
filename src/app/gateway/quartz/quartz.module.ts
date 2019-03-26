import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DataTablesModule} from 'angular-datatables';
import {CoreModule} from '../../core/core.module';
import {SharedModule} from '../../shared/shared.module';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {UserRouteAccessService} from '../../core/auth/user-route-access-service';
import {QuartzComponent} from './quartz.component';
import {QuartzService} from './quartz.service';

export const routes: Routes = [
    {
        path: '',
        component: QuartzComponent,
        data: {
            authorities: ['ROLE_USER','ROLE_ADMIN'],
            pageTitle: '任务调度'
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
        QuartzComponent
    ],
    exports: [
        SharedModule,
        RouterModule
    ],
    providers:[QuartzService]
})

export class QuartzModule { }
