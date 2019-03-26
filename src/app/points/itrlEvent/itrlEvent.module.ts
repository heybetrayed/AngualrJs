import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {CommonModule} from "@angular/common";
import {UserRouteAccessService} from "../../core/auth/user-route-access-service";
import {DataTablesModule} from "angular-datatables";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from "../../shared/shared.module";
import {CoreModule} from '../../core/core.module';
import {HttpClientModule} from '@angular/common/http';
import {ItrlEventComponent} from './itrlEvent.component';
import {ItrlEventService} from './itrlEvent.service';

export const routes: Routes = [
    {
        path: '',
        component: ItrlEventComponent,
        data: {
            authorities: ['ROLE_USER','ROLE_ADMIN'],
            pageTitle: '事件管理'
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
        ItrlEventComponent,
    ],
    exports: [
        SharedModule,
        RouterModule
    ],
    providers:[
        ItrlEventService
    ]

})
export class ItrlEventModule { }


