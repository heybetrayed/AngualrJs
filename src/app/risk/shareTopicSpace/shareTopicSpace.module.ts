import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CoreModule} from '../../core/core.module';
import {HttpClientModule} from '@angular/common/http';
import {ShareTopicSpaceComponent} from './shareTopicSpace.component';
import {NgZorroAntdModule} from 'ng-zorro-antd';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        CoreModule,
        NgZorroAntdModule
    ],
    declarations: [
        ShareTopicSpaceComponent
    ],
    exports: [
        ShareTopicSpaceComponent
    ]
})

export class ShareTopicSpaceModule {

}