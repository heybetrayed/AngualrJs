import {LayoutComponent} from '../layout/layout.component';


export const boccommonRoutes = [
    {
        path: 'boccommon',
        component: LayoutComponent,
        children: [
            {path: '', redirectTo: 'commonboard', pathMatch: 'full'},
            {
                path: 'commonboard', loadChildren: './commonboard/commonboard.module#CommonboardModule',
                data: {
                    title: '工作台',
                    module: 'boccommon/commonboard'
                }
            },
            {
                path: 'cemsdf', loadChildren: './cemsdf/cemsdf.module#CemsdfModule',
                data: {
                    title: '产品管理',
                    module: 'boccommon/cemsdf'
                }
            }
        ]
    }
];
