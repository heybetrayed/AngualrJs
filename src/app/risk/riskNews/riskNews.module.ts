import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DataTablesModule} from 'angular-datatables';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CoreModule} from '../../core/core.module';
import {SharedModule} from '../../shared/shared.module';
import {WebofficeModule} from '../../shared/weboffice/weboffice.module';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {UploaderModule} from '../../shared/uploader/uploader.module';
import {UEditorModule} from 'ngx-ueditor';

import {registerLocaleData} from '@angular/common';
import zh from '@angular/common/locales/zh';
import {RiskNewsComponent} from './riskNews.component';
import {RiskNewsService} from './riskNews.service';

registerLocaleData(zh);


export const routes: Routes = [
    {
        path: '',
        component: RiskNewsComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: '单位新闻'
        }
    }
];

@NgModule({
    imports: [
        NgZorroAntdModule,
        CommonModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        CoreModule,
        UploaderModule,
        DataTablesModule,
        WebofficeModule,
        UEditorModule.forRoot({
            js: [
                `./assets/ueditor/ueditor.all.min.js`,
                `./assets/ueditor/ueditor.config.js`,
            ],
            // 默认前端配置项
            options: {
                UEDITOR_HOME_URL: './assets/ueditor/'
            }
        }),
        RouterModule.forChild(routes),

    ],
    declarations: [
        RiskNewsComponent
    ],
    exports: [
        SharedModule,
        RouterModule
    ],
    providers: [RiskNewsService]

})

export class RiskNewsModule {
}
