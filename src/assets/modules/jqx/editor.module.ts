import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import {jqxEditorComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxeditor';


@NgModule({
    imports: [CommonModule, FormsModule],
    declarations: [jqxEditorComponent],
    exports: [jqxEditorComponent],
})
export class EditorModule { }

