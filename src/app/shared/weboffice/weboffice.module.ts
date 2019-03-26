import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WebofficeComponent} from './weboffice.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        WebofficeComponent,
    ],
    exports: [
        WebofficeComponent
    ],
    bootstrap: [WebofficeComponent],
    providers: []
})
export class WebofficeModule {

}
