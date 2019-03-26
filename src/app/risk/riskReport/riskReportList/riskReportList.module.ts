import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {RiskReportListComponent} from './riskReportList.component';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {CoreModule} from '../../../core/core.module';

@NgModule({
    imports: [
        NgZorroAntdModule,
        CommonModule,
        HttpClientModule,
        CoreModule,
    ],
    declarations: [
        RiskReportListComponent
    ],
    exports: [
    ]
})

export class RiskReportListModule {
    
}