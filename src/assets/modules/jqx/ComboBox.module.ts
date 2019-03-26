import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import {jqxComboBoxComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxcombobox';


@NgModule({
    imports: [CommonModule, FormsModule],
    declarations: [jqxComboBoxComponent],
    exports: [jqxComboBoxComponent],
})
export class ComboBoxModule { }

