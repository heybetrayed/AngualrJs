import {LayoutComponent} from '../layout/layout.component';

export const routes = [

    {
        path: 'points',
        component: LayoutComponent,
        children: [
            {path: '', redirectTo: 'pointsboard', pathMatch: 'full'},
            {
                path: 'pointsboard', loadChildren: './pointsboard/pointsboard.module#PointsboardModule',
                data: {
                    title: '工作台',
                    module: 'points/pointsboard'
                }
            },
            {
                path: 'datamanage', loadChildren: './datamanage/datamanage.module#DatamanageModule',
                data: {
                    title: '数据字典管理',
                    module: 'points/datamanage'
                }
            },
            {
                path: 'itrlChange', loadChildren: './itrlChange/itrlChange.module#ItrlChangeModule',
                data: {
                    title: '积分变动规则',
                    module: 'points/itrlChange'
                }
            },
            {
                path: 'itrlMedal', loadChildren: './itrlMedal/itrlMedal.module#ItrlMedalModule',
                data: {
                    title: '勋章管理',
                    module: 'points/itrlMedal'
                }
            },
            {
                path: 'itrlAdjust', loadChildren: './itrlAdjust/itrlAdjust.module#ItrlAdjustModule',
                data: {
                    title: '积分调整',
                    module: 'points/itrlAdjust'
                }
            },
            {
                path: 'itrlMem', loadChildren: './itrlMem/itrlMem.module#ItrlMemModule',
                data: {
                    title: '查询积分账户',
                    module: 'points/itrlMem'
                }
            },
            {
                path: 'itrlRecord', loadChildren: './itrlRecord/itrlRecord.module#ItrlRecordModule',
                data: {
                    title: 'itrlRecord',
                    module: 'points/itrlRecord'
                }
            },
            {
                path: 'itrlLimit', loadChildren: './itrlLimit/itrlLimit.module#ItrlLimitModule',
                data: {
                    title: '限制规则',
                    module: 'points/itrlLimit'
                }
            },
            {
                path: 'dataItemManage', loadChildren: './dataItemManage/dataItemManage.module#DataItemManageModule',
                data: {
                    title: 'dataItemManage',
                    module: 'points/dataItemManage'
                }
            },
            {
                path: 'saveItrlMem', loadChildren: './saveMem/saveMem.module#SaveMemModule',
                data: {
                    title: '新增积分账户',
                    module: 'points/saveItrlMem'
                }
            },
            {
                path: 'joinMobileByMem', loadChildren: './mobileJoinMem/mobileJoinMem.module#MobileJoinMemModule',
                data: {
                    title: '手机号关联账户',
                    module: 'points/joinMobileByMem'
                }
            },
            {
                path: 'itrlMemAuthentication',
                loadChildren: './itrlMemAuthentication/itrlMemAuthentication.module#ItrlMemAuthenticationModule',
                data: {
                    title: '实名认证',
                    module: 'points/itrlMemAuthentication'
                }
            },
            {
                path: 'itrlRaise', loadChildren: './itrlRaise/itrlRaise.module#ItrlRaiseModule',
                data: {
                    title: '积分增加',
                    module: 'points/itrlRaise'
                }
            },
            {
                path: 'itrlReduce', loadChildren: './itrlReduce/itrlReduce.module#ItrlReduceModule',
                data: {
                    title: '积分减少',
                    module: 'points/itrlReduce'
                }
            },
            {
                path: 'findItrlMemByDto', loadChildren: './findItrlMemberBy/findItrlMemberBy.module#FindItrlMemberByModule',
                data: {
                    title: '查询积分账户',
                    module: 'points/findItrlMemByDto'
                }
            },
            {
                path: 'itrlType', loadChildren: './itrlType/itrlType.module#ItrlTypeModule',
                data: {
                    title: '积分类型查询',
                    module: 'points/itrlType'
                }
            },
            {
                path: 'itrlEvent', loadChildren: './itrlEvent/itrlEvent.module#ItrlEventModule',
                data: {
                    title: '事件管理',
                    module: 'points/itrlEvent'
                }
            },
            {
                path: 'itrlAudit', loadChildren: './itrlAudit/itrlAudit.module#ItrlAuditModule',
                data: {
                    title: '积分审核',
                    module: 'points/itrlAudit'
                }
            }
        ]
    },
];
