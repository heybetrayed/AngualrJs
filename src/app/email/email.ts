import {LayoutComponent} from '../layout/layout.component';

export const routes = [

    {
        path: 'email',
        component: LayoutComponent,
        children: [
            {path: '', redirectTo: 'emailboard', pathMatch: 'full'},
            {
                path: 'emailboard', loadChildren: './emailboard/emailboard.module#EmailboardModule',
                data: {
                    title: '工作台',
                    module: 'email/emailboard'
                }
            },
            {
                path: 'sendEmail', loadChildren: './sendEmail/sendEmail.module#SendEmailModule',
                data: {
                    title: '发送邮件',
                    module: 'email/sendEmail'
                }
            },
            {
                path: 'emailConfig', loadChildren: './emailConfig/emailConfig.module#EmailConfigModule',
                data: {
                    title: '邮件参数配置',
                    module: 'email/emailConfig'
                }
            }
            // ,{
            //     path: 'emailTemplate', loadChildren: './emailTemplate/emailTemplate.module#EmailTemplateModule',
            //     data: {
            //         title: '邮件模板配置',
            //         module: 'email/emailTemplate'
            //     }
            // }
        ]
    },
];
