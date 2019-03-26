import {Component, OnInit} from '@angular/core';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {RiskDditDTO, RiskDditItemDTO} from './riskDditDTO';
import {RiskDditService} from './riskDdit.service';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';


declare var swal: any;

@Component({
    selector: 'app-riskDdit',
    templateUrl: './riskDdit.component.html',
    styleUrls: ['./riskDdit.component.css'],
})
export class RiskDditComponent implements OnInit {

    mr: NgbModalRef;
    searchForm: FormGroup;
    riskDditDTO: RiskDditDTO;
    saveDditForm: FormGroup;

    searchItemForm: FormGroup;
    riskDditItemDTO: RiskDditItemDTO;
    saveDditItemForm: FormGroup;

    riskDditAll: any;
    riskDditItemAll: any;

    pageIndex = 1;
    pageSize = 10;
    loading = true;
    sortValue = null;
    sortKey = null;
    total = 1;

    allChecked = false;
    indeterminate = false;
    disabledButton = true;
    operating = false;

    selectedValue = null;
    /*----------------------------详情页面参数-------------------------*/
    pageIndexItem = 1;
    pageSizeItem = 5;
    loadingItem = true;
    sortValueItem = null;
    sortKeyItem = null;
    totalItem = 1;
    isVisibleItem = false;
    dditId = 0;


    //搜索结果数据集
    allCheckedItem = false;
    indeterminateItem = false;
    disabledButtonItem = true;
    operatingItem = false;

    constructor(
        private fb: FormBuilder,
        private riskDditService: RiskDditService,
        private modalService: NzModalService,
        private nzMessageService: NzMessageService
    ) {
        this.searchForm = this.fb.group({
            dditCode: '',
            dditName: '',
            status:''
        });
        this.searchItemForm = this.fb.group({
            dditItemCode: '',
            dditItemName: '',
            dditId: ''
        })
    }

    ngOnInit() {
        this.searchData();
        /*----------------------------保存表单验证-------------------------*/
        this.saveDditForm = this.fb.group({
            id: [],
            dditCode: ['', [Validators.required]],
            dditName: ['', [Validators.required]],

        });

        this.saveDditItemForm = this.fb.group({
            id: [],
            dditItemCode: ['', [Validators.required]],
            dditItemName: ['', [Validators.required]],

        });
    }

    searchData(reset: boolean = false): void {
        this.riskDditDTO = this.searchForm.value;
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
        this.riskDditService.getAllRiskDditAll(this.riskDditDTO, params).subscribe((response: any) => {
            this.loading = false;
            this.total = response.body.recordsTotal;
            this.riskDditAll = response.body.data;
        });
    }

    // 全选
    checkAll(value: boolean): void {
        this.riskDditAll.forEach(data => data.checked = value);
        this.refreshStatus();
    }

    // checkbox - 刷新
    refreshStatus(): void {
        const allChecked = this.riskDditAll.every(value => value.checked === true);
        const allUnChecked = this.riskDditAll.every(value => !value.checked);
        this.allChecked = allChecked;
        this.indeterminate = (!allChecked) && (!allUnChecked);
        this.disabledButton = !this.riskDditAll.some(value => value.checked);

    }

    disable(riskDditId: string): void {
        /**
         * 先查询子表是否存在数据  根据  riskDditDTO.id  查询子表
         */
        this.riskDditService.getDditItemByDditId(riskDditId).subscribe((response) => {
            if (response.body > 0) {
                this.nzMessageService.error('请先删除所选数据类型下的数据');
            } else {
                this.riskDditService.disable(riskDditId).subscribe((response: any) => {
                    this.searchData();
                    this.isVisible = false;
                },(e) => this.nzMessageService.error('禁用失败!!!,<br />错误消息：' + JSON.stringify(e)));
            }
        });
    }

    // 启用
    enable(riskDditId: string): void {
        this.riskDditService.enable(riskDditId)
            .subscribe((response) => {
                this.searchData();
            }, (e) => this.nzMessageService.error('启用失败!!!,<br />错误消息：' + JSON.stringify(e)));
    }


    disableAll(): void {
        const selData = this.riskDditAll.filter(value => value.checked);
        this.operating = true;
        this.riskDditService.getAllDditItemByDditId(selData).subscribe((response) => {
            if (response.body) {
                this.nzMessageService.error('请先删除所选数据类型下的数据!!!');
                this.searchData();
                this.riskDditAll.forEach(value => value.checked = false);
                this.refreshStatus();
                this.operating = false;
            } else {
                const that = this;
                this.modalService.confirm({
                    nzTitle: '确定禁用吗?',
                    //nzContent: '<b style="color: red;">禁用后的数据不可恢复</b>',
                    nzOkText: '确定',
                    nzOkType: '危险',
                    nzOnOk: () => {
                        that.operating = true;
                        setTimeout(_ => {
                            that.riskDditService.disableAll(selData)
                                .subscribe((response) => {
                                        that.searchData();
                                        that.riskDditAll.forEach(value => value.checked = false);
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
        });
    }

    clearSearchSet() {
        this.searchForm.reset();
        this.searchData();
    }

    /*-------------------弹出新增页面------------------------*/
    isVisible = false;

    showAddDdit() {
        this.saveDditForm.reset();
        this.isVisible = true;
    }

    handleCancel(): void {
        this.isVisible = false;
    }

    resetSaveDditForm(): void {
        this.saveDditForm.reset();
    }

    resetSaveDditItemForm(): void {
        this.saveDditItemForm.reset();
    }

    /*-------------------弹出编辑页面------------------------*/
    editDdit(dditId) {
        this.saveDditForm.reset();
        this.riskDditService.getDditById(dditId).subscribe((response) => {
            this.saveDditForm.setValue({
                'id': response.body.id,
                'dditCode': response.body.dditCode,
                'dditName': response.body.dditName,
            });
            this.isVisible = true;
        });
    }

    saveDdit() {
        this.riskDditDTO = this.saveDditForm.value;
        if (this.saveDditForm.value.id == null || this.saveDditForm.value.id == '') {
            this.riskDditService.saveDDit(this.riskDditDTO).subscribe((response: any) => {
                this.nzMessageService.success('新增数据字典成功！');
                this.searchData();
                this.isVisible = false;
            });
        } else {
            this.riskDditService.updateDdit(this.riskDditDTO).subscribe((response: any) => {
                this.nzMessageService.success('更新数据字典成功！');
                this.searchData();
                this.isVisible = false;
            });
        }
    }

    /*---------------------------弹出详情页面-----------------------------*/
    details(dditId, reset: boolean = false): void {
        this.riskDditItemDTO = this.searchItemForm.value;
        this.riskDditItemDTO.dditId = dditId;
        this.dditId = dditId;
        if (reset) {
            this.pageIndexItem = 1;
        }
        this.loadingItem = true;
        const params = {
            page: this.pageIndexItem - 1,
            size: this.pageSizeItem,
        };
        if (null !== this.sortKeyItem && null !== this.sortValueItem) {
            this.sortValueItem = this.sortValueItem === 'descend' ? 'desc' : 'asc';
            params['sort'] = this.sortKeyItem + ',' + this.sortValueItem;
        }
        this.riskDditService.getAllRiskDditItemAll(this.riskDditItemDTO, params).subscribe((response: any) => {
            this.loadingItem = false;
            this.totalItem = response.body.recordsTotal;
            this.riskDditItemAll = response.body.data;
        });
        this.isVisibleItem = true;
    }

    handleCancelItem(): void {
        this.isVisibleItem = false;
    }

    /* 新增子表*/
    isVisibleItemAdd = false;

    showAddDditItem() {
        this.saveDditItemForm.reset();
        this.isVisibleItemAdd = true;
    }

    handleCancelItemAdd(): void {
        this.isVisibleItemAdd = false;
    }

    editDditItem(dditItemId) {
        this.saveDditItemForm.reset();
        this.riskDditService.getDditItemById(dditItemId).subscribe((response) => {
            this.saveDditItemForm.setValue({
                'id': response.body.id,
                'dditItemCode': response.body.dditItemCode,
                'dditItemName': response.body.dditItemName,
            });
            this.isVisibleItemAdd = true;
        });
    }

    saveDditItem() {
        this.riskDditItemDTO = this.saveDditItemForm.value;
        this.riskDditItemDTO.dditId = this.dditId;
        if (this.saveDditItemForm.value.id == null || this.saveDditItemForm.value.id == '') {
            this.riskDditService.saveDDitItem(this.riskDditItemDTO).subscribe((response: any) => {
                this.nzMessageService.success('新增数据字典成功！');
                this.details(this.dditId);
                this.isVisibleItemAdd = false;
            });
        } else {
            this.riskDditService.updateDditItem(this.riskDditItemDTO).subscribe((response: any) => {
                this.nzMessageService.success('更新数据字典成功！');
                this.details(this.dditId);
                this.isVisibleItemAdd = false;
            });
        }
    }

    deleteDditItem(riskDditItemId) {
        this.riskDditService.deleteDditItem(riskDditItemId).subscribe((response: any) => {
            this.details(this.dditId);
            this.isVisibleItemAdd = false;
        }, (e) => this.nzMessageService.error('删除失败!!!,<br />错误消息：' + JSON.stringify(e)));
    }

    // 全选
    checkAllItem(value: boolean): void {
        this.riskDditItemAll.forEach(data => data.checked = value);
        this.refreshStatusItem();
    }

    // checkbox - 刷新
    refreshStatusItem(): void {
        const allCheckedItem = this.riskDditItemAll.every(value => value.checked === true);
        const allUnCheckedItem = this.riskDditItemAll.every(value => !value.checked);
        this.allCheckedItem = allCheckedItem;
        this.indeterminateItem = (!allCheckedItem) && (!allUnCheckedItem);
        this.disabledButtonItem = !this.riskDditItemAll.some(value => value.checked);

    }

    deleteSelectedItem(): void {
        const selData = this.riskDditItemAll.filter(value => value.checked);
        const that = this;
        this.modalService.confirm({
            nzTitle: '确定删除吗?',
            nzContent: '<b style="color: red;">删除后的数据不可恢复</b>',
            nzOkText: '确定',
            nzOkType: '危险',
            nzOnOk: () => {
                that.operatingItem = true;
                setTimeout(_ => {
                    that.riskDditService.deleteDditItems(selData)
                        .subscribe((response) => {
                                this.details(this.dditId);
                                that.riskDditItemAll.forEach(value => value.checked = false);
                                that.refreshStatusItem();
                                that.operatingItem = false;
                            },
                            () => that.nzMessageService.error('删除失败！'));
                });
            },
            nzCancelText: '取消',
            nzOnCancel: () => {
                that.operatingItem = false;
            },
        });
    }

    clearSearchSetItem() {
        this.searchItemForm.reset();
        this.details(this.dditId);
    }


}

