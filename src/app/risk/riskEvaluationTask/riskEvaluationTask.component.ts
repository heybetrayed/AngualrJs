import {Component, OnInit} from '@angular/core';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {RiskEvaluationTaskService} from './riskEvaluationTask.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {OrganizationService} from '../../gateway/organization/organization.service';

declare var $: any;

@Component({
    selector: 'app-card',
    templateUrl: './riskEvaluationTask.component.html',
    styleUrls: ['./riskEvaluationTask.component.css'],
})
export class RiskEvaluationTaskComponent implements OnInit {
    searchForm: FormGroup;
    validateForm: FormGroup;

    isVisible = false;
    tableVisible = false;

    organizationDict = {};
    organizationSet: any;
    modules: null;
    // 分页参数
    selectedValue = null;
    pageIndex = 1;
    pageSize = 10;
    total = 1;
    dataSet = [];
    loading = true;
    sortValue = null;
    sortKey = null;

    // Table参数
    allChecked = false;
    indeterminate = false;
    disabledButton = true;
    checkedNumber = 0;
    operating = false;
    isOkLoading = false;
    editCache = {};

    templateSet = [];
    resultenum = {'很强': 5, '较强': 4, '中等': 3, '较弱': 2, '很弱': 1, 'N/A': 0};
    resultValue = [
        '很强', '较强', '中等', '较弱', '很弱', 'N/A'
    ];
    constructor(
        private organizationService: OrganizationService,
        private riskEvaluationTaskService: RiskEvaluationTaskService,
        private modalService: NzModalService,
        private nzMessageService: NzMessageService,
        private fb: FormBuilder
    ) {
        this.searchForm = this.fb.group({
            aTaskTitle: '',
            status:''
        });
    }


    ngOnInit() {
        this.searchData();
        this.organizationService.getOrganizations()
            .subscribe((response) => {
                this.organizationSet = response.body;
                this.organizationSet.forEach(organization => {
                    this.organizationDict[organization.id] = organization.name;
                });
            });

        this.validateForm = this.fb.group({
            aTaskTitle: null,
            aTaskRange: null,
            templateId: null,
        });
        this.initTemplateSet();
        this.init();
    }

    //表单验证
    init() {
        this.validateForm = this.fb.group({
            aTaskTitle: ['', [Validators.required]],
            aTaskRange: ['', [Validators.required]],
            templateId: ['', [Validators.required]],
        });
    }

    // 搜索数据
    searchData(reset: boolean = false): void {
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
        this.riskEvaluationTaskService.getTasks(this.searchForm.value, params)
            .subscribe((response: any) => {
                this.loading = false;
                this.total = response.body.recordsTotal;
                this.dataSet = response.body.data;
                this.updateEditCache();
            });
    }


    addTask(){
        this.isVisible = true;
    }

    submitForm(): void {
        let data = this.validateForm.value;
        data.aTaskStartDate = data.aTaskRange[0];
        data.aTaskEndDate = data.aTaskRange[1];
        this.riskEvaluationTaskService.saveTask(data).subscribe((response) => {
                this.nzMessageService.success('保存成功！');
                this.isVisible = false;
                this.searchData();
                this.init();
            });
    }

    initTemplateSet(){
        this.riskEvaluationTaskService.getTemplate({}, {})
            .subscribe((response) => {
                    this.templateSet = response.body.data;
                }, (e) => this.nzMessageService.error('获取模版信息失败!!!,<br />错误消息：' + JSON.stringify(e)));
    }

    // 排序
    sort(sort: { key: string, value: string }): void {
        this.sortKey = sort.key;
        this.sortValue = sort.value;
        this.searchData();
    }

    // 全选
    checkAll(value: boolean): void {
        this.dataSet.forEach(data => data.checked = value);
        this.refreshStatus();
    }

    // checkbox - 刷新
    refreshStatus(): void {
        const allChecked = this.dataSet.every(value => value.checked === true);
        const allUnChecked = this.dataSet.every(value => !value.checked);
        this.allChecked = allChecked;
        this.indeterminate = (!allChecked) && (!allUnChecked);
        this.disabledButton = !this.dataSet.some(value => value.checked);
        this.checkedNumber = this.dataSet.filter(value => value.checked).length;
    }

    handleCancel(){
        this.isVisible = false;
        this.tableVisible = false;
        this.init();
    }

    startEdit(id: string): void {
        this.editCache[id].edit = true;
    }

    finishEdit(data): void {
        this.editCache[data.id].edit = false;
        data.aTaskTitle = this.editCache[data.id].name;
        this.riskEvaluationTaskService.editTask(data)
            .subscribe((response) => {

                    this.searchData();
                },
                () => console.log('修改模版失败'))
    }

    updateEditCache(): void {
        this.dataSet.forEach(item => {
            if (!this.editCache[item.id]) {
                this.editCache[item.id] = {
                    edit: false,
                    name: item.aTaskTitle
                };
            }
        });
    }

    // 禁用
    disable(id: string): void {
        this.riskEvaluationTaskService.disable(id)
            .subscribe((response) => {
                    this.searchData();
                },
                (e) => this.nzMessageService.error('禁用失败!!!,<br />错误消息：' + JSON.stringify(e)));
    }

    // 启用
    enable(id: string): void {
        this.riskEvaluationTaskService.enable(id)
            .subscribe((response) => {
                this.searchData();
            }, (e) => this.nzMessageService.error('启用失败!!!,<br />错误消息：' + JSON.stringify(e)));
    }

    disableAll(): void {
        const selData = this.dataSet.filter(value => value.checked);
        const that = this;
        this.modalService.confirm({
            nzTitle: '确定禁用吗?',
            //nzContent: '<b style="color: red;">禁用后的数据不可恢复</b>',
            nzOkText: '确定',
            nzOkType: '危险',
            nzOnOk: () => {
                that.operating = true;
                setTimeout(_ => {
                    that.riskEvaluationTaskService.disableAll(selData)
                        .subscribe((response) => {
                                that.searchData();
                                that.dataSet.forEach(value => value.checked = false);
                                that.refreshStatus();
                                that.operating = false;
                            },
                            () => that.nzMessageService.error('禁用失败！'));
                });
            },
            nzCancelText: '取消',
            nzOnCancel: () =>{
                that.operating = false;
            },

        });
    }

    clearSearchSet() {
        this.searchForm.reset();
        this.searchData();
    }

    inputData(dataTask) {
        this.riskEvaluationTaskService.getInputTable(dataTask.templateId)
            .subscribe((response) => {
                this.modules = response.body.modules;
                this.tableVisible = true;
            })
    }

    submitInputTable() {
        console.log(this.modules);
    }
}

