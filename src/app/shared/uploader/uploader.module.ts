import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UploaderComponent} from './uploader.component';
import {FileUploadModule} from 'ng2-file-upload';

@NgModule({
    imports: [
        CommonModule,
        FileUploadModule
    ],
    declarations: [
        UploaderComponent,
    ],
    exports: [
        UploaderComponent
    ],
    bootstrap: [UploaderComponent],
    providers: []
})
export class UploaderModule {

}
