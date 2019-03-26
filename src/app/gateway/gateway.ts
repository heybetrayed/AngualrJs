
import { LayoutComponent } from '../layout/layout.component';




export const gatewayRoutes = [
    {
        path: 'gateway',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'gateboard', pathMatch: 'full' },
            {
                path: 'gateboard',
                loadChildren: './gateboard/gateboard.module#GateboardModule',
                data: {
                    title: '工作台',
                    module: 'gateway/gateboard'
                }
            },
            {
                path: 'user',
                loadChildren: './user/user.module#UserModule',
                data: {
                    title: '用户管理',
                    module: 'gateway/user'
                }
            },
            {
                path: 'role',
                loadChildren: './role/role.module#RoleModule',
                data: {
                    title: '角色管理',
                    module: 'gateway/role'
                }
            },
            {
                path: 'session',
                loadChildren: './session/session.module#SessionModule',
                data: {
                    title: '会话管理',
                    module: 'gateway/session'
                }
            },
            {
                path: 'system',
                loadChildren: './system/system.module#SystemModule',
                data: {
                    title: '系统管理',
                    module: 'gateway/system'
                }
            },
            {
                path: 'organization',
                loadChildren: './organization/organization.module#OrganizationModule',
                data: {
                    title: '组织管理',
                    module: 'gateway/organization'
                }
            },
            {
                path: 'permission',
                loadChildren: './permission/permission.module#PermissionModule',
                data: {
                    title: '权限管理',
                    module: 'gateway/permission'
                }
            },
            {
                path: 'quartz',
                loadChildren: './quartz/quartz.module#QuartzModule',
                data: {
                    title: '任务调度',
                    module: 'gateway/quartz'
                }
            },
            {
                path: 'treePermission',
                loadChildren: './treePermission/treePermission.module#TreePermissionModule',
                data: {
                    title: '角色权限',
                    module: 'gateway/treePermission'
                }
            },
            {   path: 'permissions',
                loadChildren: './permissions/permissions.module#PermissionsModule',
                data: {
                    title: '角色权限',
                    module: 'gateway/permissions'
                }
             },
            {
                path: 'uploader',
                loadChildren: './uploader-file/uploader-file.module#UploaderFileModule',
                data: {
                    title: '文件上传',
                    module: 'gateway/uploader'
                }
            },
            {
                path: 'activiti',
                loadChildren: './activiti/activiti.module#ActivitiModule',
                data: {
                    title: '流程管理',
                    module: 'gateway/activiti'
                }
            }

        ]
    }
];
