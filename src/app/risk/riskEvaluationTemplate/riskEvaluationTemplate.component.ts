import {Component, OnInit} from '@angular/core';
import {RiskEvaluationTemplateService} from './riskEvaluationTemplate.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';

declare var $: any;
declare var swal: any;

@Component({
    selector: 'app-card',
    templateUrl: './riskEvaluationTemplate.component.html',
    styleUrls: ['./riskEvaluationTemplate.component.css'],
})
export class RiskEvaluationTemplateComponent implements OnInit {

    searchForm: FormGroup;
    //过滤时搜索条件
    searchSet = {
        aTName: null
    };
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
    operating = false;
    //添加模版弹窗是否可见
    isVisible = false;
    isOkLoading = false;
    // 新增模块表单
    validateForm: FormGroup;
    editCache = {};

    constructor(
        private fb: FormBuilder,
        private riskEvaluationTemplateService: RiskEvaluationTemplateService,
        private modalService: NzModalService,
        private nzMessageService: NzMessageService)
    {

        this.searchForm = this.fb.group({
            aTName: '',
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
    addTemplate(): void {
        this.isVisible = true;
    }

    /**
     *  初始化表单输入
     */
    init(){
        this.validateForm = this.fb.group({
            aTName: ['', [Validators.required]],
            aTDescript: ['', [Validators.required]]
        });
    }

    handleOk(): void {
        this.isOkLoading = true;
        window.setTimeout(() => {
            this.isVisible = false;
            this.isOkLoading = false;
        }, 3000);
        this.init();
    }

    /**
     *  弹窗点击关闭
     */
    handleCancel(): void {
        this.isVisible = false;
        this.init();
    }

    /**
     * 提交新增模版表单
     */
    submitForm(): void {
        this.riskEvaluationTemplateService.addTemplate(this.validateForm.value)
            .subscribe((response: any) => {
                this.searchData();
                this.isVisible = false;
                this.init();
            });
    }

    /**
     *  查询数据
     * @param reset 是否重置为第一页
     */
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
        this.riskEvaluationTemplateService.getTemplate(this.searchForm.value, params)
            .subscribe((response: any) => {
                this.loading = false;
                this.total = response.body.recordsTotal;
                this.dataSet = response.body.data;
                this.updateEditCache();
            });
    }

    /**
     * 重制搜索
     */

    clearSearchSet() {
        this.searchForm.reset();
        this.searchData();
    }

    /**
     *  排序
     * @param sort 排序条件
     */
    sort(sort: { key: string, value: string }): void {
        this.sortKey = sort.key;
        this.sortValue = sort.value;
        this.searchData();
    }

    /**
     *  全选
     * @param value 全选或是全部不选
     */
    checkAll(value: boolean): void {
        this.dataSet.forEach(data => data.checked = value);
        this.refreshStatus();
    }

    /**
     * 刷新状态 1.是否为全选状态
     *         2.删除所选按钮是否可用
     */
    refreshStatus(): void {
        const allChecked = this.dataSet.every(value => value.checked === true);
        const allUnChecked = this.dataSet.every(value => !value.checked);
        this.allChecked = allChecked;
        this.indeterminate = (!allChecked) && (!allUnChecked);

        this.disabledButton = !this.dataSet.some(value => value.checked);
    }

    /**
     *  删除单行
     * @param id 行id
     */
    deleteRow(id: string): void {
        this.riskEvaluationTemplateService.deleteTemplate(id)
            .subscribe((response) => {
                this.searchData();
            },
                (e) => this.nzMessageService.error('删除因素失败!!!,<br />错误消息：' + JSON.stringify(e)));
    }

    enableRow(id: string): void {
        this.riskEvaluationTemplateService.enableTemplate(id)
            .subscribe((response) => {
                    this.searchData();
                },
                (e) => this.nzMessageService.error('删除因素失败!!!,<br />错误消息：' + JSON.stringify(e)));
    }

    /**
     * 多行删除所选
     */
    deleteSelected(): void {

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
                    that.riskEvaluationTemplateService.deleteMultiTemplate(selData)
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

    /**
     * 开始编辑
     * @param id 编辑内容id
     */
    startEdit(id: string): void {
        this.editCache[id].edit = true;
    }

    /**
     * 完成编辑
     * @param data 编辑内容
     */
    finishEdit(data): void {
        this.editCache[data.id].edit = false;
        data.aTName = this.editCache[data.id].name;
        this.riskEvaluationTemplateService.editTemplate(data)
            .subscribe((response) => {
                    this.searchData();
                })
    }

    /**
     * 重制编辑内容为空
     */
    updateEditCache(): void {
        this.dataSet.forEach(item => {
            if (!this.editCache[item.id]) {
                this.editCache[item.id] = {
                    edit: false,
                    name: item.aTName
                };
            }
        });
    }

}

