import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import {jqxGridComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';


@NgModule({
    imports: [CommonModule, FormsModule],
    declarations: [jqxGridComponent],
    exports: [jqxGridComponent],
})
export class GridModule { }

