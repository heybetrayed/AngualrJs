import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {RiskEvaluationModuleService} from './riskEvaluationModule.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

declare var $: any;
declare var swal: any;

@Component({
    selector: 'app-card',
    templateUrl: './riskEvaluationModule.component.html',
    styleUrls: ['./riskEvaluationModule.component.css'],
})
export class RiskEvaluationModuleComponent implements OnInit {
    searchForm: FormGroup;
    // 弹窗参数
    isVisible = false;
    // 分页参数
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
    // 新增模块表单
    validateForm: FormGroup;
    editCache = {};
    constructor(
        private fb: FormBuilder,
        private riskEvaluationModuleService: RiskEvaluationModuleService,
        private modalService: NzModalService,
        private nzMessageService: NzMessageService
    ) {
        this.searchForm = this.fb.group({
            aMName: '',
            status: ''
        });
    }
    ngOnInit() {
        this.searchData();
        this.init();
    }
    //表单验证
    init() {
        this.validateForm = this.fb.group({
            aMName: ['', [Validators.required]],
            aMDescript: ['', [Validators.required]]
        });
    }
    addModule(): void {
        this.isVisible = true;
    }
    // 提交表单
    submitForm(): void {
        this.riskEvaluationModuleService.createModule(this.validateForm.value)
            .subscribe((response: any) => {
                this.searchData();
                this.isVisible = false;
                this.init();
            })
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
            this.sortValue = this.sortValue === 'descend' ? 'desc' : 'asc'
            params['sort'] = this.sortKey + ',' + this.sortValue;
        }
        this.riskEvaluationModuleService.getModule(this.searchForm.value, params)
            .subscribe((response: any) => {
                this.loading = false;
                this.total = response.body.recordsTotal;
                this.dataSet = response.body.data;
                this.updateEditCache();
            });
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

    // 删除
    deleteRow(id: string): void {
        this.riskEvaluationModuleService.deleteModule(id)
            .subscribe((response) => {
                    this.searchData();
                }, (e) => this.nzMessageService.error('删除模板失败!!!,<br />错误消息：' + JSON.stringify(e)));
    }

    enableRow(id: string): void {
        this.riskEvaluationModuleService.enableModule(id)
            .subscribe((response) => {
                this.searchData();
            }, (e) => this.nzMessageService.error('删除模板失败!!!,<br />错误消息：' + JSON.stringify(e)));
    }

    deleteSelected(): void {
        const selData = this.dataSet.filter(value => value.checked);
        const that = this;
        this.modalService.confirm({
            nzTitle: '确定禁用吗?',
          //  nzContent: '<b style="color: red;">删除后的数据不可恢复</b>',
            nzOkText: '确定',
            nzOkType: '危险',
            nzOnOk: () => {
                that.operating = true;
                setTimeout(_ => {
                    that.riskEvaluationModuleService.deleteMultiModules(selData)
                        .subscribe((response) => {
                                that.searchData();
                                that.dataSet.forEach(value => value.checked = false);
                                that.refreshStatus();
                                that.operating = false;
                            }, () => that.nzMessageService.error('禁用失败！'));
                });
            },
            nzCancelText: '取消',
            nzOnCancel: () => {
                that.operating = false;
            }

        });
    }

    startEdit(id: string): void {
        this.editCache[id].edit = true;
    }

    finishEdit(data): void {
        this.editCache[data.id].edit = false;
        data.aMName = this.editCache[data.id].name;
        this.riskEvaluationModuleService.editModule(data)
            .subscribe((response) => {
                    this.searchData();
                },)
    }

    updateEditCache(): void {
        this.dataSet.forEach(item => {
            if (!this.editCache[item.id]) {
                this.editCache[item.id] = {
                    edit: false,
                    name: item.aMName
                };
            }
        });
    }

    operateData(): void {
        const selData = this.dataSet.filter(value => value.checked);
        this.nzMessageService.info(JSON.stringify(selData));

        this.operating = true;
        setTimeout(_ => {
            this.dataSet.forEach(value => value.checked = false);
            this.refreshStatus();
            this.operating = false;
        }, 1000);
    }

    clearSearchSet() {
        this.searchForm.reset();
        this.searchData();
    }

    handleOk(): void {
        this.isOkLoading = true;
        window.setTimeout(() => {
            this.isVisible = false;
            this.isOkLoading = false;
        }, 3000);
    }

    handleCancel(): void {
        this.isVisible = false;
        this.init();
    }

}

