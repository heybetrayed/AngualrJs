import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './system';
import {SharedModule} from "../shared/shared.module";
import { ElkComponent } from './elk/elk.component';


@NgModule({
    imports: [
        SharedModule,
        RouterModule.forRoot(routes)
    ],
    declarations: [],
    exports: [
        RouterModule
    ],
    providers:[]
})

export class SystemModule {

}
