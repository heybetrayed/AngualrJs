import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserRouteAccessService} from '../../core/auth/user-route-access-service';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CoreModule} from '../../core/core.module';
import {ButtonModule} from '../../../assets/modules/jqx/Button.module';
import {ReportCatalogComponent} from './reportCatalog.component';
import {ReportCatalogService} from './reportCatalog.service';
import {NgZorroAntdModule} from 'ng-zorro-antd';

export const routes: Routes = [
    {
        path: '',
        component: ReportCatalogComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: '风险目录维护'
        },
        canActivate: [UserRouteAccessService]
    }
];

@NgModule({
    imports: [
        CommonModule,
        NgZorroAntdModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        ButtonModule,
        CoreModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        ReportCatalogComponent,
    ],
    exports: [
    ],
    bootstrap: [ReportCatalogComponent],
    providers: [
        ReportCatalogService
    ]
})

export class ReportCatalogModule {
}
