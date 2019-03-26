import {LayoutComponent} from '../layout/layout.component';


export const cleanuiRoutes = [
    {
        path: 'cleanui',
        component: LayoutComponent,
        children: [
            {path: '', redirectTo: 'documentation', pathMatch: 'full'},
            {
                path: 'documentation', loadChildren: './documentation/documentation.module#DocumentationModule',
                data: {
                    title: 'Documentation',
                    module: 'cleanui/documentation'
                }
            },
            {
                path: 'ecommerce', loadChildren: './ecommerce/ecommerce.module#EcommerceModule',
                data: {
                    title: 'ecommerce',
                    module: 'cleanui/ecommerce'
                }
            },
            {
                path: 'apps', loadChildren: './apps/apps.module#AppsModule',
                data: {
                    title: 'apps',
                    module: 'cleanui/apps'
                }
            },
            {
                path: 'charts', loadChildren: './charts/charts.module#ChartsModule',
                data: {
                    title: 'charts',
                    module: 'cleanui/charts'
                }
            },
            {
                path: 'components', loadChildren: './components/components.module#ComponentsModule',
                data: {
                    title: 'components',
                    module: 'cleanui/components'
                }
            },
            {
                path: 'forms', loadChildren: './forms/forms.module#FormsModule',
                data: {
                    title: 'forms',
                    module: 'cleanui/forms'
                }
            },
            {
                path: 'icons', loadChildren: './icons/icons.module#IconsModule',
                data: {
                    title: 'icons',
                    module: 'cleanui/icons'
                }
            },
            {
                path: 'pages', loadChildren: './pages/pages.module#PagesModule',
                data: {
                    title: 'pages',
                    module: 'cleanui/pages'
                }
            },
            {
                path: 'tables', loadChildren: './tables/tables.module#TablesModule',
                data: {
                    title: 'tables',
                    module: 'cleanui/tables'
                }
            },
            {
                path: 'layout', loadChildren: './layout/layout.module#LayoutModule',
                data: {
                    title: 'layout',
                    module: 'cleanui/layout'
                }
            }
        ]
    }
];
