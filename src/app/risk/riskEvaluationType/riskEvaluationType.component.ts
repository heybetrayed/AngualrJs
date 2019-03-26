import {Component, OnInit} from '@angular/core';
import {RiskEvaluationTypeService} from './riskEvaluationType.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';

declare var $: any;
declare var swal: any;

@Component({
    selector: 'app-card',
    templateUrl: './riskEvaluationType.component.html',
    styleUrls: ['./riskEvaluationType.component.css'],
})
export class RiskEvaluationTypeComponent implements OnInit {

    searchForm: FormGroup;
    validateForm: FormGroup;
    //分页
    pageIndex = 1;
    pageSize = 10;
    total = 1;
    //搜索结果数据集
    dataSet = [];
    loading = true;
    sortValue = null;
    sortKey = null;
    allChecked = false;
    indeterminate = false;
    disabledButton = true;
    //添加类型弹窗是否可见
    isVisible = false;
    operating = false;
    editCache = {};

    constructor(
        private fb: FormBuilder,
        private riskEvaluationTypeService: RiskEvaluationTypeService,
        private modalService: NzModalService,
        private nzMessageService: NzMessageService
    ) {

        this.searchForm = this.fb.group({
            aTypeName: '',
            status: ''
        });
    }

    ngOnInit() {
        this.searchData();
        this.init();
    }

    /**
     *  showModal() 显示弹窗
     */
    addType(): void {
        this.isVisible = true;
    }

    /**
     * 初始化表单输入
     */
    init() {
        this.validateForm = this.fb.group({
            aTypeName: ['', [Validators.required]],
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
            this.sortValue = this.sortValue === 'descend' ? 'desc' : 'asc'
            params['sort'] = this.sortKey + ',' + this.sortValue;
        }
        this.riskEvaluationTypeService.getTypes(this.searchForm.value, params)
            .subscribe((response: any) => {
                this.loading = false;
                this.total = response.body.recordsTotal;
                this.dataSet = response.body.data;
                this.updateEditCache();
            });
    }

    // 过滤筛选
    updateFilter(value: string[]): void {
        this.searchData(true);
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
    }

    handleCancel(): void {
        this.isVisible = false;
        this.init();
    }

    submitForm(): void {
        this.riskEvaluationTypeService.createType(this.validateForm.value)
            .subscribe((response) => {
                if (this.dataSet.length == 0) {
                    this.dataSet = [];
                }
                this.searchData();
                this.isVisible = false;
                this.init();
            })
    }

    // 删除
    deleteRow(id: string): void {
        this.riskEvaluationTypeService.deleteType(id)
            .subscribe((response) => {
                    this.searchData();
                },
                (e) => this.nzMessageService.error('删除因素失败!!!,<br />错误消息：' + JSON.stringify(e)));
    }

    enableRow(id: string): void {
        this.riskEvaluationTypeService.enableType(id)
            .subscribe((response) => {
                    this.searchData();
                },
                (e) => this.nzMessageService.error('恢复因素失败!!!,<br />错误消息：' + JSON.stringify(e)));
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
                    that.riskEvaluationTypeService.deleteMultiTypes(selData)
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
        data.aTypeName = this.editCache[data.id].name;
        this.riskEvaluationTypeService.editType(data)
            .subscribe((response) => {
                this.searchData();
            })
    }

    updateEditCache(): void {
        this.dataSet.forEach(item => {
            if (!this.editCache[item.id]) {
                this.editCache[item.id] = {
                    edit: false,
                    name: item.aTypeName
                };
            }
        });
    }

    clearSearchSet() {
        this.searchForm.reset();
        this.searchData();
    }
}

