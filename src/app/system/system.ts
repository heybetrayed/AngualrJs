import {LayoutComponent} from '../layout/layout.component';

export const routes = [

    {
        path: 'system',
        component: LayoutComponent,
        children: [
            {path: '', redirectTo: 'systemboard', pathMatch: 'full'},
            {
                path: 'systemboard', loadChildren: './systemboard/systemboard.module#SystemboardModule',
                data: {
                    title: '工作台',
                    module: 'system/systemboard'
                }
            },
            {
                path: 'confparameter', loadChildren: './confparameter/confparameter.module#ConfparameterModule',
                data: {
                    title: '配置参数',
                    module: 'system/confparameter'
                }
            },
            {
                path: 'searchresults', loadChildren: './searchresults/searchresults.module#SearchresultsModule',
                data: {
                    title: '检索结果',
                    module: 'system/searchresults'
                }
            },
            {
                path: 'operationlog', loadChildren: './operationlog/operationlog.module#OperationlogModule',
                data: {
                    title: '操作日志',
                    module: 'system/operationlog'
                }
            },
            {
                path: 'elk', loadChildren: './elk/elk.module#ElkModule',
                data: {
                    title: '日志查询',
                    module: 'system/elk'
                }
            },
            {
                path: 'swagger', loadChildren: './swagger/swagger.module#SwaggerModule',
                data: {
                    title: '接口文档',
                    module: 'system/swagger'
                }
            },
            {
                path: 'zipkin', loadChildren: './zipkin/zipkin.module#ZipkinModule',
                data: {
                    title: '调用链查询',
                    module: 'system/zipkin'
                }
            },
        ]
    },
];
