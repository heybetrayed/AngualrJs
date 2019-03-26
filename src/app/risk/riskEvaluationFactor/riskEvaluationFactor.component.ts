import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {RiskEvaluationFactorService} from './riskEvaluationFactor.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {OrganizationService} from '../../gateway/organization/organization.service';

@Component({
    selector: 'app-card',
    templateUrl: './riskEvaluationFactor.component.html',
    styleUrls: ['./riskEvaluationFactor.component.css'],
})
export class RiskEvaluationFactorComponent implements OnInit {

    searchForm: FormGroup;

    // 新建因素时选择部门
    selectedValue = null;

    organizationSet = [];
    organizationDict = {};

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
    editCache = {};

    constructor(
        private organizationService: OrganizationService,
        private fb: FormBuilder,
        private riskEvaluationFactorService: RiskEvaluationFactorService,
        private modalService: NzModalService,
        private nzMessageService: NzMessageService
    ) {

        this.searchForm = this.fb.group({
            aFTitle: '',
            aFDescript: '',
            aFDeptId: '',
            aFSource: '',
            status: ''
        });
    }

    ngOnInit() {
        this.organizationService.getOrganizations()
            .subscribe((response) => {
                this.organizationSet = response.body;
                this.organizationSet.forEach(organization => {
                    this.organizationDict[organization.id] = organization.name;
                });
                this.searchData();
            });
        this.init();
    }

    /**
     *  表单验证
     */
    init() {
        this.validateForm = this.fb.group({
            aFTitle: ['', [Validators.required]],
            aFDescript: ['', [Validators.required]],
            aFDeptId: ['', [Validators.required]],
            aFSource: ['', [Validators.required]],
        });
    }

    // 新增元素
    addFactor(): void {
        this.isVisible = true;
    }

    // 新增因素校验表单
    validateForm: FormGroup;

    // 提交表单
    submitForm(): void {
        this.riskEvaluationFactorService.createFactor(this.validateForm.value)
            .subscribe((response) => {
                this.isVisible = false;
                this.searchData();
                this.init();
            })
    }

    // 搜索数据
    searchData(reset: boolean = false): void {
        // 如果为true，则offset为0，从第一个开始搜索
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

        this.riskEvaluationFactorService.getFactors(params, this.searchForm.value)
            .subscribe((response: any) => {
                this.loading = false;
                this.total = response.body.recordsTotal;
                this.dataSet = response.body.data;
                // this.modifyDeptIdToName();
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
        this.riskEvaluationFactorService.deleteModule(id)
            .subscribe((response) => {
                    this.searchData();
                },
                (e) => this.nzMessageService.error('删除因素失败!!!,<br />错误消息：' + JSON.stringify(e)));
    }

    enableRow(id: string): void {
        this.riskEvaluationFactorService.enableModule(id)
            .subscribe((response) => {
                    this.searchData();
                },
                (e) => this.nzMessageService.error('恢复因素失败!!!,<br />错误消息：' + JSON.stringify(e)));
    }

    // 批量删除
    deleteSelected(): void {
        const selData = this.dataSet.filter(value => value.checked);
        const that = this;
        this.modalService.confirm({
            nzTitle: '确定禁用吗?',
           // nzContent: '<b style="color: red;">删除后的数据不可恢复</b>',
            nzOkText: '确定',
            nzOkType: '危险',
            nzOnOk: () => {
                that.operating = true;
                setTimeout(_ => {
                    that.riskEvaluationFactorService.deleteMultiFactors(selData)
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
            },

        });
    }

    getOrganizationById(id): any {
        for (let organization of this.organizationSet) {
            if (organization.id == id) {
                return organization;
            }
        }
    }

    startEdit(data): void {
        this.editCache[data.id].data.aFDeptId = this.getOrganizationById(this.editCache[data.id].data.aFDeptId);
        console.log(this.editCache);
        this.editCache[data.id].edit = true;
    }

    cancelEdit(id: string): void {
        this.editCache[id].data.aFDeptId = this.editCache[id].data.aFDeptId.id;
        this.editCache[id].edit = false;
    }

    saveEdit(id: string): void {
        let data = this.editCache[id].data;
        data.aFDeptId = data.aFDeptId.id;
        this.riskEvaluationFactorService.editModule(data)
            .subscribe((response) => {
                this.editCache[id].edit = false;
                this.searchData();
            });
    }

    updateEditCache(): void {
        this.dataSet.forEach(item => {
            if (!this.editCache[item.id]) {
                this.editCache[item.id] = {
                    edit: false,
                    data: item
                };
            }
        });
    }

    // Reload
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

    compareFn = (o1: any, o2: any) => {
        return o1 && o2 ? o1.id === o2.id : o1 === o2
    };


    handleOk(): void {
        this.isOkLoading = true;
        window.setTimeout(() => {
            this.isVisible = false;
            this.isOkLoading = false;
            this.init();
        }, 3000);
    }

    handleCancel(): void {
        this.isVisible = false;
        this.init();
    }
}

