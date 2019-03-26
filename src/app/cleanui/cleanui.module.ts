import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared/shared.module';
import {cleanuiRoutes} from './cleanui';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';


@NgModule({
    imports: [
        SharedModule,
        RouterModule.forRoot(cleanuiRoutes),
        BrowserAnimationsModule,
        NoopAnimationsModule
    ],
    declarations: [],
    exports: [
        RouterModule
    ],
    providers: [

    ]
})

export class CleanuiModule {

}
