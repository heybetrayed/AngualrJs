import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService, NzModalRef, NzModalService} from 'ng-zorro-antd';
import {RiskReportService} from './riskReport.service';
import {RiskReportDto} from './riskReportDto';
import {RiskAnalyzeDto} from './riskAnalyzeDto';
import {UEditorComponent} from 'ngx-ueditor';
import {ActivitiDto} from '../../gateway/activiti/activiti-dto';
import {OrganizationService} from '../../gateway/organization/organization.service';
import {ActivitiService} from '../../gateway/activiti/activiti.service';
import {TaskDTO} from '../../gateway/activiti/task-dto';


@Component({
    selector: 'app-risk-report',
    templateUrl: './riskReport.component.html',
    styleUrls: ['./riskReport.component.css']
})
export class RiskReportComponent implements OnInit {

    @ViewChild('uEditor') uEditor: UEditorComponent;
    searchForm: FormGroup;
    saveReportRecord: FormGroup;
    riskReportDto: RiskReportDto;
    reportTypeId = null;
    flowStatus = ['保存待发', '已发', '审批中', '已结束'];

    constructor(
        private fb: FormBuilder,
        private el: ElementRef,
        private modalService: NzModalService,
        private mssageService: NzMessageService,
        private riskReportService: RiskReportService,
        private nzMessageService: NzMessageService,
        private activitiService: ActivitiService
    ) {
        this.searchForm = this.fb.group({
            name: null
        })
    }

    // 报告记录
    riskreportsRecord: any;
    // 报告类型
    reportTypes: any;
    // 风险报告任务
    tasks: any;

    ngOnInit(): void {
        this.riskReportService.getAllTasks().subscribe((response) => {
            this.tasks = response.body;
        });

        this.listFlowAll();

        // 获取类别
        this.riskReportService.getAllDigitizationType().subscribe((response) => {
            this.reportTypes = response.body;
            console.log(this.reportTypes);
            this.reportTypeId = this.reportTypes[0].id;
            this.searchData();
        });

        this.saveReportRecord = this.fb.group({
            id: [],
            taskId: ['', [Validators.required]],
            name: ['', [Validators.required]],
            comment: ['', [Validators.required]],
            modelId: [null, [Validators.required]]
        });

    }


    pageIndex = 1;
    pageSize = 10;
    loading = true;
    sortValue = null;
    sortKey = null;
    total = 1;

    searchData(reset: boolean = false): void {
        this.riskReportDto = this.searchForm.value;
        // 根据报告类型查询报告记录
        this.riskReportDto.type = this.reportTypeId;
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

        this.riskReportService.getAllRecords(this.riskReportDto, params)
            .subscribe((response: any) => {
                this.loading = false;
                this.total = response.body.recordsTotal;
                this.riskreportsRecord = response.body.data;
            });
    }


    /*----------------- 新增记录 --------------------*/
    isSaveRecord = false;

    createRecord() {
        this.saveReportRecord.reset();
        this.isSaveRecord = true;

    }

    handleAddRecordCancel() {
        this.isSaveRecord = false;
    }

    handleSaveAnalyzesCancel() {
        this.monitorLeftInfos = new Array<any>();
        this.monitorRightInfos = new Array<any>();
        this.isSaveAnalyzes = false;
    }

    handleShowAnalyzesCancel() {
        this.monitorLeftInfos = new Array<any>();
        this.monitorRightInfos = new Array<any>();
        this.isShowAnalyzes = false;
    }

    saveRecord() {
        this.riskReportDto = this.saveReportRecord.value;
        this.riskReportDto.type = this.reportTypeId;

        this.riskReportService.createRecord(this.riskReportDto).subscribe(() => {
            this.searchData(true);
            this.isSaveRecord = false;
            this.nzMessageService.success('保存成功！');
        }, () => {
            this.nzMessageService.error('保存失败！');
        })
    }

    recordId: number;

    selectType(reportType): void {
        this.reportTypeId = reportType.id;
        console.log(reportType);
        this.searchData();
    }


    isSaveAnalyzes = false;
    // 报告信息  类型 数据  分析
    monitorLeftInfos = new Array<any>();
    monitorRightInfos = new Array<any>();
    inputValue: string;
    index: number = 0;

    // 参数  风险记录对象
    showAnalyzes(riskReportDto: RiskReportDto) {
        this.index = 0;
        this.recordId = riskReportDto.id;
        this.monitorLeftInfos = new Array<any>();
        this.monitorRightInfos = new Array<any>();
        // 根据 riskReportDto.type  riskReportDto.taskId
        this.riskReportService.getMonitorInfos(riskReportDto).subscribe((response: any) => {
            response.body.forEach(value => {
                if ('0' == value.monitorTypeDetail.mTypeGroup) {
                    this.monitorLeftInfos.push(value);
                } else {
                    this.monitorRightInfos.push(value);
                }
            });
            this.selectInofo(this.monitorRightInfos[0]);
        });
        this.isSaveAnalyzes = true;
    }

    /**
     * 查看
     * @param riskReportDto
     */
    isShowAnalyzes = false;
    showValue: string;
    recordData: any;

    lookAnalyzes(riskReportDto: RiskReportDto) {
        this.recordData = riskReportDto;
        this.index = 0;
        this.recordId = riskReportDto.id;
        this.monitorLeftInfos = new Array<any>();
        this.monitorRightInfos = new Array<any>();
        // 根据 riskReportDto.type  riskReportDto.taskId
        this.riskReportService.getMonitorInfos(riskReportDto).subscribe((response: any) => {
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

    riskAnalyzeDto: RiskAnalyzeDto;
    monitorTypeDetailId: number;

    selectInofo(monitorInfo) {
        this.inputValue = '';
        if (monitorInfo.reportAnalyzeList.length !== 0) {
            for (let i in monitorInfo.reportAnalyzeList) {
                this.inputValue = monitorInfo.reportAnalyzeList[i].content == null ? '' : monitorInfo.reportAnalyzeList[i].content;
                this.riskAnalyzeDto = monitorInfo.reportAnalyzeList[i];
            }
        } else {
            this.riskAnalyzeDto = new RiskAnalyzeDto;
        }
        this.monitorTypeDetailId = monitorInfo.monitorTypeDetail.id;
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
        this.monitorTypeDetailId = monitorInfo.monitorTypeDetail.id;
    }

    saveAnalyzes(status) {
        this.riskReportService.saveAnalyzes(this.monitorRightInfos, status).subscribe((response: any) => {
            this.nzMessageService.success('操作成功！');
            this.isSaveAnalyzes = false;
            this.searchData();
        }, (e) => {
            console.log(e);
        });
    }

    // 全选
    checkAll(value: boolean): void {
        this.riskreportsRecord.forEach(data => data.checked = value);
        this.refreshStatus();
    }

    // checkbox - 刷新
    allChecked = false;
    indeterminate = false;

    refreshStatus(): void {
        const allChecked = this.riskreportsRecord.every(value => value.checked === true);
        const allUnChecked = this.riskreportsRecord.every(value => !value.checked);
        this.allChecked = allChecked;
        this.indeterminate = (!allChecked) && (!allUnChecked);
    }


    /* ------------------------  排序  -----------------------------*/
    sort(sort: { key: string, value: string }): void {
        this.sortKey = sort.key;
        this.sortValue = sort.value;
        this.searchData();
    }

    flowAll: Array<ActivitiDto>;
    activitiDto: ActivitiDto;

    listFlowAll(): any {
        const params = {
            page: this.pageIndex - 1,
            size: this.pageSize,
        };
        this.activitiService.listAllModelsByParams(this.activitiDto, params)
            .subscribe((response: any) => {
                this.flowAll = response.body.data;
            });
    }

    bpmnModal: NzModalRef;
    @ViewChild('activitiContent') activitiContent: TemplateRef<any>;
    iframe: string;
    selectFlow: string;

    showBpmnModal(): void {
        // 1.校验
        this.saveReportRecord.get('modelId').clearValidators();
        this.saveReportRecord.get('modelId').markAsPristine();
        this.saveReportRecord.get('modelId').updateValueAndValidity();
        if (this.saveReportRecord.valid) {
            if (null != this.saveReportRecord.get('modelId').value) {
                this.showBpmn(this.saveReportRecord.get('modelId').value);
            } else {
                // 2.创建模板
                let activiti: ActivitiDto = {
                    id: this.saveReportRecord.get('taskId').value,
                    name: this.saveReportRecord.get('name').value,
                    key: new Date().toDateString(),
                    description: this.saveReportRecord.get('comment').value
                }
                this.activitiService.saveModel(activiti).subscribe((response) => {
                    this.saveReportRecord.patchValue({
                        'modelId': response.body.id
                    })

                    // 添加选项
                    this.flowAll.push(response.body);
                    this.selectFlow = response.body.id;

                    //
                    this.saveReportRecord.get('modelId').setValidators(Validators.required);
                    this.saveReportRecord.get('modelId').markAsDirty();
                    this.saveReportRecord.get('modelId').updateValueAndValidity();

                    this.showBpmn(response.body.id);
                });
            }
        }
    }

    /**
     * 打开流程设计器
     * @param modelId
     */
    showBpmn(modelId: string): void {
        this.iframe = 'activitios/modeler.html?modelId=' + modelId;

        this.bpmnModal = this.modalService.create({
            nzTitle: null,
            nzContent: this.activitiContent,
            nzFooter: null,
            nzWidth: 1000,
            nzMaskClosable: false,
            nzClosable: true,
            nzBodyStyle: {padding: '0px'}
        });
    }

    /**
     *
     */
    saveContent(): void {
        // 赋值
        // this.monitorRightInfos.forEach(rightInfo => {
        //     rightInfo.reportAnalyzeList.forEach(analyze => {
        //         if (analyze.id === this.riskAnalyzeDto.id) {
        //             analyze.content = this.inputValue;
        //         }
        //     })
        // })
        this.riskAnalyzeDto.recordId = this.recordId;
        this.riskAnalyzeDto.monitorTypeDetailId = this.monitorTypeDetailId;
        this.riskAnalyzeDto.content = this.inputValue;
    }

    /**
     * 查看流程图
     */
    workflowImgModal: NzModalRef;
    @ViewChild('tplworkflowImg') tplworkflowImg: TemplateRef<any>;
    processInstId: string;

    showWorkflowImg() {
        this.processInstId = this.recordData.flowable[0]['procInstId'];
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
    dataSet:Array<TaskDTO> ;
    workflowListModal: NzModalRef;
    @ViewChild('tplworkflowList') tplworkflowList: TemplateRef<any>;

    showWorkflowList() {
        this.processInstId = this.recordData.flowable[0]['procInstId'];

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


}
