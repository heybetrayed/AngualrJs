import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {UserRouteAccessService} from '../../core/auth/user-route-access-service';
import {UploaderFileComponent} from './uploader-file.component';
import {UploaderModule} from '../../shared/uploader/uploader.module';
import {SharedModule} from '../../shared/shared.module';
import {ReactiveFormsModule} from '@angular/forms';

export const routes: Routes = [
    {
        path: '',
        component: UploaderFileComponent,
        data: {
            authorities: ['ROLE_ADMIN','ROLE_USER'],
            pageTitle: '文件上传'
        },
        canActivate:[UserRouteAccessService]
    }
];

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        UploaderModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
      UploaderFileComponent
    ],
    exports: [
        SharedModule,
        RouterModule
    ],
})
export class UploaderFileModule { }
