import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RiskDigitizationService} from './riskDigitization.service';
import {NzMessageService, NzModalRef, NzModalService} from 'ng-zorro-antd';
import {RiskDigitizationDTO} from './risk-digitization-dto';
import {MonitorRecordDTO} from './monitor-record-dto';
import {RiskTaskService} from '../riskTask/riskTask.service';
import {RiskTaskDTO} from '../riskTask/riskTaskDTO';
import {OrganizationService} from '../../gateway/organization/organization.service';
import {ActivitiService} from '../../gateway/activiti/activiti.service';
import {ActivitiDto} from '../../gateway/activiti/activiti-dto';
import {forEach} from '@angular/router/src/utils/collection';
import {TaskDTO} from '../../gateway/activiti/task-dto';

@Component({
    selector: 'app-risk-digitization',
    styleUrls: ['./riskDigitization.component.css'],
    templateUrl: './riskDigitization.component.html'
})


export class RiskDigitizationComponent implements OnInit {

    searchForm: FormGroup;
    riskDigitizations: any;
    riskDigitizationDTO: RiskDigitizationDTO;
    allChecked = false;
    indeterminate = false;
    DigitizationTypes: any;
    // modal
    isRiskDigitizationVisible = false;
    showRiskDigitizationVisible = false;

    selectTabName: string;

    // 搜索数据
    pageIndex = 1;
    pageSize = 10;
    loading = true;
    sortValue = null;
    sortKey = null;
    total = 1;
    flowStatus = ['保存待发', '已发', '审批中', '已结束'];

    organization: String;

    constructor(
        private fb: FormBuilder,
        private el: ElementRef,
        private riskDigitizationService: RiskDigitizationService,
        private messageService: NzMessageService,
        private riskTaskService: RiskTaskService,
        private modalService: NzModalService,
        private organizationService: OrganizationService,
        private activitiService: ActivitiService
    ) {
        this.searchForm = this.fb.group({
            name: '',
            type: '',
        });

        this.validateForm = this.fb.group({
            name: [null, [Validators.required]],
            comment: [null, [Validators.required]],
            taskId: [null, [Validators.required]],
            type: [null, [Validators.required]],
            modelId: [null, [Validators.required]]
        });
    }

    ngOnInit(): void {
        this.getAllTasks();
        this.listFlowAll();
        // 获取类别
        this.riskDigitizationService.getAllDigitizationType().subscribe((response) => {
            this.DigitizationTypes = response.body;

            if (this.DigitizationTypes.length !== 0) {
                let firstId = this.DigitizationTypes[0].id;
                this.searchForm.patchValue({
                    type: firstId,
                })
            }

            // 获取当前登录人的部门
            this.riskDigitizationService.getOrganization().subscribe((response) => {
                this.organizationService.getOrganization(response.body.organizations[0]).subscribe((response) => {
                    this.organization = response.body.name;
                    console.log(response.body.name);

                });

            });


            this.selectTabName = this.DigitizationTypes[0].mTypeName;
            this.searchData();
        })
    }

    riskTaskDTO: RiskTaskDTO = new RiskTaskDTO();
    taskAll: any;

    getAllTasks() {
        this.riskTaskDTO.status = 1;
        this.riskTaskService.getEffectTask(this.riskTaskDTO)
            .subscribe((response) => {
                this.taskAll = response.body['data'];
            })
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

    searchData(reset: boolean = false): void {
        this.riskDigitizationDTO = this.searchForm.value;
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

        this.riskDigitizationService.listAllRiskDigitization(this.riskDigitizationDTO, params)
            .subscribe((response: any) => {
                this.loading = false;
                this.total = response.body.recordsTotal;
                this.riskDigitizations = response.body.data;
            });
    }

    // 全选
    checkAll(value: boolean): void {
        this.riskDigitizations.forEach(data => data.checked = value);
        this.refreshStatus();
    }

    // checkbox - 刷新
    refreshStatus(): void {
        const allChecked = this.riskDigitizations.every(value => value.checked === true);
        const allUnChecked = this.riskDigitizations.every(value => !value.checked);
        this.allChecked = allChecked;
        this.indeterminate = (!allChecked) && (!allUnChecked);
    }


    handleRiskDigitizationCancel(): void {
        this.isRiskDigitizationVisible = false;
    }

    handleShowDigitizationCancel(): void {
        this.showRiskDigitizationVisible = false;
    }

    selectTab(args: any[]): void {
        this.selectTabName = args[2];
        this.searchForm.patchValue({
            type: args[1]
        });
        this.searchData();
    }

    // 新建
    isRDVisible = false;
    isRDOkLoading = false;
    validateForm: FormGroup;
    addtitle: string = '';
    monitorRecord: MonitorRecordDTO;

    create() {
        this.addtitle = '新增 - ' + this.selectTabName;
        this.validateForm.patchValue({'type': this.searchForm.get('type').value});
        this.isRDVisible = true;
    }

    handleCancel(): void {
        this.validateForm.reset();
        this.isRDVisible = false;
    }

    // 提交表单
    submitForm(): void {
        this.isRDOkLoading = true;
        this.monitorRecord = this.validateForm.value;
        this.riskDigitizationService.saveRiskDigitization(this.monitorRecord).subscribe((response) => {
            this.messageService.success('操作成功');
            this.isRDVisible = false;
            this.isRDOkLoading = false;
            this.validateForm.reset();

            // 如果为已发，则调用流程平台发起流程
            this.searchData();
        }, (error) => {
            this.messageService.error('操作失败');
        });
    }

    /* ---------------- 编辑模版 ------------------*/
    tables = [];
    templates = [];
    recordData: any;

    editTaskDigitization(data: any) {
        this.recordData = data;
        this.riskDigitizationService.getAllTables(data).subscribe((response) => {
            this.tables = response.body;
        });
        this.isRiskDigitizationVisible = true;
    }

    lookTaskDigitization(data: any) {
        this.recordData = data;
        this.riskDigitizationService.getAllTables(data).subscribe((response) => {
            this.tables = response.body;
        });
        this.showRiskDigitizationVisible = true;
    }

    saveTables(status) {
        this.riskDigitizationService.saveAllTables(this.tables, this.recordData.id, status)
            .subscribe((response) => {
                this.isRiskDigitizationVisible = false;
                this.messageService.success('操作成功！')

                this.searchData();
            }, (error) => {
                this.messageService.error('操作失败！');
            })
    }

    bpmnModal: NzModalRef;
    @ViewChild('activitiContent') activitiContent: TemplateRef<any>;
    iframe: string;
    selectFlow: string;

    showBpmnModal(): void {
        // 1.校验
        this.validateForm.get('modelId').clearValidators();
        this.validateForm.get('modelId').markAsPristine();
        this.validateForm.get('modelId').updateValueAndValidity();

        if (this.validateForm.valid) {
            if (null != this.validateForm.get('modelId').value) {
                this.showBpmn(this.validateForm.get('modelId').value);
            } else {
                // 2.创建模板
                let activiti: ActivitiDto = {
                    id: this.validateForm.get('taskId').value,
                    name: this.validateForm.get('name').value,
                    key: new Date().toDateString(),
                    description: this.validateForm.get('comment').value
                }
                this.activitiService.saveModel(activiti).subscribe((response) => {
                    this.validateForm.patchValue({
                        'modelId': response.body.id
                    })

                    // 添加选项
                    this.flowAll.push(response.body);
                    this.selectFlow = response.body.id;

                    //
                    this.validateForm.get('modelId').setValidators(Validators.required);
                    this.validateForm.get('modelId').markAsDirty();
                    this.validateForm.get('modelId').updateValueAndValidity();

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

