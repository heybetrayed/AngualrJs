import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import {jqxButtonComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxbuttons';

@NgModule({
    imports: [CommonModule, FormsModule],
    declarations: [jqxButtonComponent],
    exports: [jqxButtonComponent],
})
export class ButtonModule { }

