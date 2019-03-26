import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SaveMemComponent} from './saveMem.component';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {SaveMemService} from './saveMem.service';
import {UserRouteAccessService} from '../../core/auth/user-route-access-service';
import {FileUploadModule} from 'ng2-file-upload';


export const routes: Routes = [
    {
        path: '',
        component: SaveMemComponent,
        data: {
            authorities: ['ROLE_USER','ROLE_ADMIN'],
            pageTitle: '添加账户'
        },
        canActivate:[UserRouteAccessService]
    }
];


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FileUploadModule,
        RouterModule.forChild(routes)
    ],
    declarations:[
        SaveMemComponent
    ],
    exports: [
        RouterModule
    ],
    providers:[SaveMemService
       ]
})
export class SaveMemModule { }