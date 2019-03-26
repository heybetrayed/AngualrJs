import {LayoutComponent} from '../layout/layout.component';


export const routes = [

    {
        path: 'risk',
        component: LayoutComponent,
        children: [
            {path: '', redirectTo: 'riskboard', pathMatch: 'full'},
            {
                path: 'riskboard', loadChildren: './riskboard/riskboard.module#RiskboardModule',
                data: {
                    title: '工作台',
                    module: 'risk/riskboard'
                }
            },{
                path: 'riskReport', loadChildren: './riskReport/riskReport.module#RiskReportModule',
                data: {
                    title: '风险报告',
                    module: 'risk/riskReport'
                }
            },{
                path: 'riskDigitization', loadChildren: './riskDigitization/riskDigitization.module#RiskDigitizationModule',
                data: {
                    title: '数据化监控',
                    module: 'risk/riskDigitization'
                }
            },{
                path: 'riskDigitizationTopicSpace', loadChildren: './riskDigitizationTopicSpace/riskDigitizationTopicSpace.module#RiskDigitizationTopicSpaceModule',
                data: {
                    title: '数据化监控主题空间',
                    module: 'risk/riskDigitizationTopicSpace'
                }
            },{
                path: 'riskSentMatter', loadChildren: './riskSentMatter/riskSentMatter.module#RiskSentMatterModule',
                data: {
                    title: '已发事项',
                    module: 'risk/riskSentMatter'
                }
            },{
                path: 'riskTodo', loadChildren: './riskTodo/riskTodo.module#RiskTodoModule',
                data: {
                    title: '待办事项',
                    module: 'risk/riskTodo'
                }
            },{
                path: 'riskDfMatter', loadChildren: './riskDfMatter/riskDfMatter.module#RiskDfMatterModule',
                data: {
                    title: '待发事项',
                    module: 'risk/riskDfMatter'
                }
            },{
                path: 'riskDoneMatter', loadChildren: './riskDoneMatter/riskDoneMatter.module#RiskDoneMatterModule',
                data: {
                    title: '已发事项',
                    module: 'risk/riskDoneMatter'
                }
            },{
                path: 'riskSupervisionMatter', loadChildren: './riskSupervisionMatter/riskSupervisionMatter.module#RiskSupervisionMatterModule',
                data: {
                    title: '督办事项',
                    module: 'risk/riskSupervisionMatter'
                }
            },{
                path: 'riskCreateMatter', loadChildren: './riskCreateMatter/riskCreateMatter.module#RiskCreateMatterModule',
                data: {
                    title: '新建事项',
                    module: 'risk/riskCreateMatter'
                }
            },{
                path: 'riskTopicSpace', loadChildren: './riskTopicSpace/riskTopicSpace.module#RiskTopicSpaceModule',
                data: {
                    title: '主题空间',
                    module: 'risk/riskTopicSpace'
                }
            },{
                path: 'riskDocuments', loadChildren: './riskDocuments/riskDocuments.module#RiskDocumentsModule',
                data: {
                    title: '制度查询',
                    module: 'risk/riskDocuments'
                }
            },
            {
                path: 'riskRegTask', loadChildren: './riskRegTask/riskRegTask.module#RiskRegTaskModule',
                data: {
                    title: '整章建制',
                    module: 'risk/riskRegTask'
                }
            }, {
                path: 'riskFileFlow', loadChildren: './riskFileFlow/riskFileFlow.module#RiskFileFlowModule',
                data: {
                    title: '发起任务',
                    module: 'risk/riskFileFlow'
                }
            }, {
                path: 'reportCatalog', loadChildren: './reportCatalog/reportCatalog.module#ReportCatalogModule',
                data: {
                    title: '风险目录',
                    module: 'risk/reportCatalog'
                }
            },
            {
                path: 'riskTemp', loadChildren: './riskTemp/riskTemp.module#RiskTempModule',
                data: {
                    title: '风险模板维护',
                    module: 'risk/riskTemp'
                }
            },{
                path: 'riskTempConfig', loadChildren: './riskTempConfig/riskTempConfig.module#RiskTempConfigModule',
                data: {
                    title: '风险模板配置',
                    module: 'risk/riskTempConfig'
                }
            },{
                path: 'riskMonitorType', loadChildren: './riskMonitorType/riskMonitorType.module#RiskMonitorTypeModule',
                data: {
                    title: '风险监控类型维护',
                    module: 'risk/riskMonitorType'
                }
            },{
                path: 'riskMonitorTypeTemp', loadChildren: './riskMonitorTypeTemp/riskMonitorTypeTemp.module#RiskMonitorTypeTempModule',
                data: {
                    title: '风险类型模板维护',
                    module: 'risk/riskMonitorTypeTemp'
                }
            }, {
                path: 'riskDdit', loadChildren: './riskDdit/riskDdit.module#RiskDditModule',
                data: {
                    title: '数据字典维护',
                    module: 'risk/riskDdit'
                }
            }, {
                path: 'riskFileTopicSpace', loadChildren: './riskFileTopicSpace/riskFileTopicSpace.module#RiskFileTopicSpaceModule',
                data: {
                    title: '主题空间',
                    module: 'risk/riskFileTopicSpace'
                }
            }, {
                path: 'riskEvaluationFactor', loadChildren: './riskEvaluationFactor/riskEvaluationFactor.module#RiskEvaluationFactorModule',
                data: {
                    title: '评估因素',
                    module: 'risk/riskEvaluationFactor'
                }
            },{
                path: 'riskEvaluationType', loadChildren: './riskEvaluationType/riskEvaluationType.module#RiskEvaluationTypeModule',
                data: {
                    title: '评估类型',
                    module: 'risk/riskEvaluationType'
                }
            },{
                path: 'riskEvaluationModule', loadChildren: './riskEvaluationModule/riskEvaluationModule.module#RiskEvaluationModuleModule',
                data: {
                    title: '评估模块',
                    module: 'risk/riskEvaluationModule'
                }
            },{
                path: 'riskEvaluationTemplate', loadChildren: './riskEvaluationTemplate/riskEvaluationTemplate.module#RiskEvaluationTemplateModule',
                data: {
                    title: '评估模板',
                    module: 'risk/riskEvaluationTemplate'
                }
            },{
                path: 'riskEvaluationTask', loadChildren: './riskEvaluationTask/riskEvaluationTask.module#RiskEvaluationTaskModule',
                data: {
                    title: '评估任务',
                    module: 'risk/riskEvaluationTask'
                }
            },{
                path: 'riskEvaluationRelation', loadChildren:'./riskEvaluationRelation/riskEvaluationRelation.module#RiskEvaluationRelationModule',
                data: {
                    title: '评估配置',
                    module: 'risk/riskEvaluationRelation'
                }
            },{
                path: 'news', loadChildren:'./riskNews/riskNews.module#RiskNewsModule',
                data: {
                    title: '单位新闻',
                    module: 'risk/riskNews'
                }
            }
            ,{
                path: 'task', loadChildren:'./riskTask/riskTask.module#RiskTaskModule',
                data: {
                    title: '发布任务',
                    module: 'risk/riskTask'
                }
            }

        ]
    },
];
