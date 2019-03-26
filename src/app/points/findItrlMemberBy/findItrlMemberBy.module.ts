import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {FindItrlMemberByComponent} from './findItrlMemberBy.component';
import {CommonModule} from "@angular/common";
import {DataTablesModule} from "angular-datatables";
import {SharedModule} from '../../shared/shared.module';
import {ReactiveFormsModule} from '@angular/forms';
import {CoreModule} from '../../core/core.module';
import {FindItrlMemberByService} from './findItrlMemberBy.service';

export const routes: Routes = [
    {
        path: '',
        component: FindItrlMemberByComponent,
    }
];

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        DataTablesModule,CoreModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        FindItrlMemberByComponent
    ],
    exports: [
        SharedModule,
        RouterModule
    ],
    providers:[
        FindItrlMemberByService
    ]
})
export class FindItrlMemberByModule { }
