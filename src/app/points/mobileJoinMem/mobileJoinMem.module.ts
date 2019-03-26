import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MobilejoinmemComponent} from './mobileJoinMem.component';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {SaveMemService} from '../saveMem/saveMem.service';
import {UserRouteAccessService} from '../../core/auth/user-route-access-service';

export const routes: Routes = [
    {
        path: '',
        component: MobilejoinmemComponent,
        data: {
            authorities: ['ROLE_USER','ROLE_ADMIN'],
            pageTitle: '关联手机号'
        },
        canActivate:[UserRouteAccessService]
    }
];


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes)
    ],
    declarations:[
        MobilejoinmemComponent
    ],
    exports: [
        RouterModule
    ],
    providers:[SaveMemService]
})
export class MobileJoinMemModule { }