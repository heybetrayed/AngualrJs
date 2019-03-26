import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ItrlMemComponent} from './itrlMem.component';
import {CommonModule} from "@angular/common";
import {DataTablesModule} from "angular-datatables";
import {SharedModule} from '../../shared/shared.module';
import {ReactiveFormsModule} from '@angular/forms';
import {CoreModule} from '../../core/core.module';
import {UserRouteAccessService} from '../../core/auth/user-route-access-service';
import {ItrlMemService} from './itrlMem.service';
import {FileUploadModule} from 'ng2-file-upload';

export const routes: Routes = [
    {
        path: '',
        component: ItrlMemComponent,
        data: {
            authorities: ['ROLE_USER','ROLE_ADMIN'],
            pageTitle: '积分用户'
        },
        canActivate:[UserRouteAccessService]
    }
];

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FileUploadModule,
        DataTablesModule,CoreModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        ItrlMemComponent,
    ],
    exports: [
        SharedModule,
        RouterModule
    ],
    providers:[
        ItrlMemService
    ]
})
export class ItrlMemModule { }
