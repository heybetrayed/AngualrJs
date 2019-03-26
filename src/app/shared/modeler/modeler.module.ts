import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModelerComponent} from './modeler.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        ModelerComponent,
    ],
    exports: [
        ModelerComponent
    ],
    bootstrap: [ModelerComponent],
    providers: []
})
export class ModelerModule {

}
