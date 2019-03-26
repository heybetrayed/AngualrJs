import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';

import {TablesBasicTables} from './basic-tables.page';
import {TablesDataTables} from './datatables.page';
import {TablesEditableTables} from './editable-tables.page';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {AntTablesPage, RandomUserService} from './ant-tables.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


export const routes: Routes = [
    {path: 'ant-tables', component: AntTablesPage},
    {path: 'basic-tables', component: TablesBasicTables},
    {path: 'datatables', component: TablesDataTables},
    {path: 'editable-tables', component: TablesEditableTables}
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        AntTablesPage,
        TablesBasicTables,
        TablesDataTables,
        TablesEditableTables
    ],
    providers: [
        RandomUserService
    ]

})

export class TablesModule {
}
