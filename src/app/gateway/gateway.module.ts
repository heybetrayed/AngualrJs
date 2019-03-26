import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {gatewayRoutes} from "./gateway";
import {SharedModule} from "../shared/shared.module";


@NgModule({
    imports: [
        SharedModule,
        RouterModule.forRoot(gatewayRoutes),
    ],
    declarations: [
    ],
    exports: [
        RouterModule
    ]
})

export class GateWayModule {

}
