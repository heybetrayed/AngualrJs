import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared/shared.module';
import {boccommonRoutes} from './boccommon';


@NgModule({
    imports: [
        SharedModule,
        RouterModule.forRoot(boccommonRoutes),
    ],
    declarations: [
    ],
    exports: [
        RouterModule
    ]
})

export class BoccommonModule {

}
