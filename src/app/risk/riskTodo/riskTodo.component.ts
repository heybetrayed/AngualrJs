import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RiskTodoService} from './riskTodo.service';
import {TaskDTO} from './task-dto';
import {NzMessageService, NzModalRef, NzModalService} from 'ng-zorro-antd';
import {ActivitiService} from '../../gateway/activiti/activiti.service';
import {RiskDigitizationService} from '../riskDigitization/riskDigitization.service';
import {RiskTodoDto} from './riskTodoDto';
import {FlowableService} from '../flowable.service';
import {Flowable} from '../flowable';
import {RiskReportService} from '../riskReport/riskReport.service';
import {RiskAnalyzeDto} from '../riskReport/riskAnalyzeDto';
import {RiskReportDto} from '../riskReport/riskReportDto';

@Component({
    selector: 'app-risk-todo',
    templateUrl: './riskTodo.component.html'
})
export class RiskTodoComponent implements OnInit {

    searchForm: FormGroup;
    sendBackForm: FormGroup;

    // 搜索数据参数
    pageIndex = 1;
    pageSize = 10;
    loading = true;
    sortValue = null;
    sortKey = null;
    total = 1;

    constructor(
        private fb: FormBuilder,
        private riskTodoService: RiskTodoService,
        private modalService: NzModalService,
        private nzMessageService: NzMessageService,
        private activitiService: ActivitiService,
        private riskDigitizationService: RiskDigitizationService,
        private riskReportService: RiskReportService,
        private flowableService: FlowableService
    ) {
        this.searchForm = this.fb.group({
            name: ''
        });

        this.sendBackForm = this.fb.group({
            comment: ['', [Validators.required]],
        });
    }

    ngOnInit() {
        this.searchData();
    }

    riskTodos: any;
    taskDto: TaskDTO;

    searchData(reset: boolean = false): void {
        this.taskDto = this.searchForm.value;
        if (reset) {
            this.pageIndex = 1;
        }
        this.loading = true;
        const params = {
            page: this.pageIndex - 1,
            size: this.pageSize,
        };

        if (null !== this.sortKey && null !== this.sortValue) {
            this.sortValue = this.sortValue === 'descend' ? 'desc' : 'asc';
            params['sort'] = this.sortKey + ',' + this.sortValue;
        }

        this.loading = false;

        // 获取数据
        this.riskTodoService.listAllRiskTodo(this.taskDto, params)
            .subscribe((response: any) => {
                this.loading = false;
                this.total = response.body.recordsTotal;
                this.riskTodos = response.body.data;
            });
    }

    // 全选
    allChecked = false;
    indeterminate = false;

    checkAll(value: boolean): void {
        this.riskTodos.forEach(data => data.checked = value);
        this.refreshStatus();
    }

    // checkbox - 刷新
    refreshStatus(): void {
        const allChecked = this.riskTodos.every(value => value.checked === true);
        const allUnChecked = this.riskTodos.every(value => !value.checked);
        this.allChecked = allChecked;
        this.indeterminate = (!allChecked) && (!allUnChecked);

    }

    /**
     * 查看流程图
     */
    workflowImgModal: NzModalRef;
    @ViewChild('tplworkflowImg') tplworkflowImg: TemplateRef<any>;
    processInstId: string;

    showWorkflowImg() {
        this.processInstId = this.selectData.processInstanceId;
        this.workflowImgModal = this.modalService.create({
            nzTitle: null,
            nzContent: this.tplworkflowImg,
            nzFooter: null,
            nzWidth: 600,
            nzMaskClosable: true,
            nzClosable: false,
            nzBodyStyle: {padding: '10px'}
        });

    }

    /**
     * 查看审批记录
     */
    dataSet: Array<TaskDTO>;
    workflowListModal: NzModalRef;
    @ViewChild('tplworkflowList') tplworkflowList: TemplateRef<any>;

    showWorkflowList() {
        this.processInstId = this.selectData.processInstanceId;

        this.activitiService.listAllTaskHistory(this.processInstId).subscribe((response) => {
            this.dataSet = response.body;
        });

        this.workflowListModal = this.modalService.create({
            nzTitle: null,
            nzContent: this.tplworkflowList,
            nzFooter: null,
            nzWidth: 600,
            nzMaskClosable: true,
            nzClosable: false,
            nzBodyStyle: {padding: '10px'}
        });

    }


    tables = [];
    templates = [];
    flowable: Flowable;

    // 待办事项
    selectData = new RiskTodoDto();

    // 是否弹窗
    showRiskDigitizationVisible = false;

    editTaskDigitization(riskTodoDto: RiskTodoDto) {
        this.selectData = riskTodoDto;
        //  通过流程ID获取RecordID
        this.flowableService.getFlowableByProcInstId(riskTodoDto.processInstanceId).subscribe((response) => {
            this.flowable = response.body;
            // 根据flowable 获取Record
            if (this.flowable.module == 0) {
                // 根据 flowable 中的 recordId  查询 数字化监控记录
                this.riskDigitizationService.getMonitorRecordDTO(this.flowable.recordId).subscribe((monitorRecord) => {
                    // 根据数字化监控查询数字化监控数据
                    this.riskDigitizationService.getAllTablesProcessInstance(this.flowable.procInstId, monitorRecord.body).subscribe((response) => {
                        this.tables = response.body;
                    });
                });
                this.showRiskDigitizationVisible = true;

            } else {
                // 风险报告
                // 根据 flowable 中的 recordId  查询 报告记录
                this.riskReportService.getReportRecordDto(this.flowable.recordId).subscribe((response) => {
                    this.lookAnalyzes(this.flowable.procInstId, response.body);
                });
            }

        });

    }

    handleShowDigitizationCancel(): void {
        this.showRiskDigitizationVisible = false;
    }

    /**
     * 同意
     */
    apply() {
        this.activitiService.apply(this.flowable.taskId).subscribe((response) => {
            // 更新flowable中的task
            this.flowableService.updateNewTask(this.flowable.id).subscribe((response) => {
                this.nzMessageService.success('操作成功！');
            });

            this.searchData();
            this.isShowAnalyzes = false;
            this.showRiskDigitizationVisible = false;
        });
    }

    isShowAnalyzes = false;
    showValue: string;
    monitorLeftInfos = new Array<any>();
    monitorRightInfos = new Array<any>();
    index: number = 0;
    recordId: number;
    riskAnalyzeDto: RiskAnalyzeDto;

    handleShowAnalyzesCancel() {
        this.monitorLeftInfos = new Array<any>();
        this.monitorRightInfos = new Array<any>();
        this.isShowAnalyzes = false;
    }

    lookAnalyzes(procInstId: string, riskReportDto: RiskReportDto) {
        this.index = 0;
        this.monitorLeftInfos = new Array<any>();
        this.monitorRightInfos = new Array<any>();
        // 根据 riskReportDto.type  riskReportDto.taskId
        this.riskReportService.getMonitorInfosProcessInstance(procInstId, riskReportDto).subscribe((response: any) => {
            response.body.forEach(value => {
                if ('0' == value.monitorTypeDetail.mTypeGroup) {
                    this.monitorLeftInfos.push(value);
                } else {
                    this.monitorRightInfos.push(value);
                }
            });
            this.selectShowInfo(this.monitorRightInfos[0]);
        });
        this.isShowAnalyzes = true;
    }

    selectShowInfo(monitorInfo) {
        this.showValue = null;
        if (monitorInfo.reportAnalyzeList.length !== 0) {
            for (let i in monitorInfo.reportAnalyzeList) {
                this.showValue = monitorInfo.reportAnalyzeList[i].content;
                this.riskAnalyzeDto = monitorInfo.reportAnalyzeList[i];
            }
        } else {
            this.riskAnalyzeDto = new RiskAnalyzeDto;
        }
    }

    /**
     * 退回
     */
    isSendBack: boolean = false;

    sendBack() {
        this.isSendBack = true;
    }

    saveSendBack() {
        this.activitiService.rollback(this.flowable.taskId,this.sendBackForm.value).subscribe((response) => {
            // 更新flowable的状态为编辑
            this.flowableService.changeStatus(this.flowable.id).subscribe((response) => {
                this.nzMessageService.success('操作成功！');
            });

        }, (response) => {
            this.nzMessageService.error('操作失败: ' + JSON.stringify(response['error']));
        });

        this.searchData();
        this.showRiskDigitizationVisible = false;
        this.isShowAnalyzes = false;
        this.isSendBack = false;
    }

    sendBackCancel(){
        this.isSendBack = false;
    }

}

