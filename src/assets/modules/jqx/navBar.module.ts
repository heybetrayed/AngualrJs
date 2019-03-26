import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import {jqxNavBarComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxnavbar';


@NgModule({
    imports: [CommonModule, FormsModule],
    declarations: [jqxNavBarComponent],
    exports: [jqxNavBarComponent],
})
export class NavBarModule { }

