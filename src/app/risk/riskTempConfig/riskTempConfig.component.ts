import {Component, OnInit} from '@angular/core';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {RiskTempConfigService} from './riskTempConfig.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';


declare var $: any;
declare var swal: any;

@Component({
    selector: 'app-risk-temp-config',
    templateUrl: 'riskTempConfig.component.html',
    styleUrls: ['riskTempConfig.component.css']
})
export class RiskTempConfigComponent implements OnInit {
    searchForm: FormGroup;
    //类型集合
    typeSet = [];
    //搜索集合
    showFilter = false;
    isVisible = false;
    selectedValue;
    pageIndex = 1;
    pageSize = 10;
    total = 1;
    dataSet = [];
    loading = true;
    sortValue = null;
    sortKey = null;
    allChecked = false;
    indeterminate = false;
    disabledButton = true;
    checkedNumber = 0;
    operating = false;
    //创建模版提交内容
    validateForm: FormGroup;
    isOkLoading = false;
    tableObj = [[{cellvalue: ' '}]];
    columnNum = 1;
    //表格大小
    size = 'small';
    //编辑基础数据
    editCache = {};

    constructor(
        private riskTempConfigService: RiskTempConfigService,
        private nzMessageService: NzMessageService,
        private modalService: NzModalService,
        private fb: FormBuilder
    ) {
        this.searchForm = this.fb.group({
            tTName: '',
            status: ''
        });
    }

    ngOnInit() {
        this.searchData();
        // this.getTypes();
        this.validateForm = this.fb.group({
            templateJson: [],
            comment: ['', [Validators.required]],
            tTName: ['', [Validators.required]]
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

        this.riskTempConfigService.getTemplate(this.searchForm.value, params)
            .subscribe((response: any) => {
                this.loading = false;
                this.total = response.body.recordsTotal;
                this.dataSet = response.body.data;
                this.updateEditCache();
            });
    }

    sort(sort: { key: string, value: string }): void {
        this.sortKey = sort.key;
        this.sortValue = sort.value;
        this.searchData();
    }

    /*-------------------------  获取类型  -----------------------------*/

    getTypeName(id): string {
        for (let type of this.typeSet) {
            if (type.id == id) {
                return type.mTypeName;
            }
        }
    }

    getTypeById(id): any {
        for (let type of this.typeSet) {
            if (type.id == id) {
                return type;
            }
        }
    }

    // getTypes() {
    //     this.riskTempConfigService.getTypes()
    //         .subscribe((response: any) => {
    //                 this.typeSet = response.body;
    //             },
    //             () => {
    //                 this.nzMessageService.error('无法获取模版类型');
    //             })
    // }

    /*--------------------------  选择 ------------------------------------*/

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

    /*----------------------------  禁用  -----------------------------*/
    // 禁用
    disable(id: string): void {
        this.riskTempConfigService.disable(id).subscribe((response) => {
                    this.searchData();
                }, (e) => this.nzMessageService.error('禁用失败!!!,<br />错误消息：' + JSON.stringify(e)));
    }


    // 启用
    enable(id: string): void {
        this.riskTempConfigService.enable(id).subscribe((response) => {
                    this.searchData();
                }, (e) => this.nzMessageService.error('启用失败!!!,<br />错误消息：' + JSON.stringify(e)));
    }




    // 批量禁用
    disableAll(): void {
        const selData = this.dataSet.filter(value => value.checked);
        const that = this;
        this.modalService.confirm({
            nzTitle: '确定禁用吗?',
           // nzContent: '<b style="color: red;">禁用后的数据不可恢复</b>',
            nzOkText: '确定',
            nzOkType: '危险',
            nzOnOk: () => {
                that.operating = true;
                setTimeout(_ => {
                    that.riskTempConfigService.disableAll(selData)
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


    clearSearchSet() {
        this.searchForm.reset();
        this.searchData();
    }

    /*-------------------------- 新增模版 --------------------------- */

    addTemplate() {
        this.tableObj = [[{cellvalue: ' '}]];
        this.columnNum = 1;
        this.isVisible = true;
    }

    handleCancel(): void {
        this.isVisible = false;
        this.validateForm.reset();
    }

    submitForm(): void {
        let json = JSON.stringify(this.tableObj);
        this.validateForm.value.templateJson = json;
        this.riskTempConfigService.addTemplate(this.validateForm.value)
            .subscribe((response: any) => {
                this.searchData();
                this.tableObj = [];
                this.isVisible = false;
                this.validateForm.reset();
                this.nzMessageService.success("保存成功！");
            }, (error) => {
                this.nzMessageService.error('保存失败！');
            });
    }

    addColumn(): void {
        this.columnNum++;
        this.tableObj.forEach((row) => {
            let num = this.columnNum - row.length;
            for (let i = 0; i < num; i++) {
                row.push({cellvalue: ' '});
            }
        })
    }

    addRow(): void {
        this.tableObj.push(this.getRow(this.tableObj.length));
        console.log(this.validateForm.value);
        console.log(this.tableObj);
    }

    getRow(rowNum: number): any {
        let rowObj = [];
        for (let i = 0; i < this.columnNum; i++) {
            // let cellvalue = 'column' + rowNum + i;
            rowObj.push({cellvalue: ''});
        }

        return rowObj;
    }

    /*---------------------------  查看和修改模版  ----------------------------*/

    //查看修改模版对象
    templateObj = [[{cellvalue: ''}]];
    //查看模版
    inspectVisible = false;
    inspectTemplateIsOkLoading = false;
    inspectColumnNum = 1;
    isInspect = true;
    nowData: any;

    reset() {
        this.templateObj = [[{cellvalue: ''}]];
        this.inspectColumnNum = 1;
    }

    submitModifiedTemplate() {
        console.log(this.nowData);
        let json = JSON.stringify(this.templateObj);
        this.nowData.templateJson = json;
        this.riskTempConfigService.editTemplate(this.nowData)
            .subscribe((response: any) => {
                    this.searchData();
                    this.templateObj = [];
                    this.inspectVisible = false;
                    this.nzMessageService.success("保存模板成功！")
                },
                () => {
                    this.nzMessageService.error("保存模板失败！");
                    this.inspectVisible = false;
                });
    }

    inspectTemplateCancel() {
        this.inspectVisible = false;
    }

    inspectTemplateOK() {
        this.inspectTemplateIsOkLoading = true;
        window.setTimeout(() => {
            this.inspectTemplateIsOkLoading = false;
            this.inspectTemplateIsOkLoading = false;
        }, 3000);
    }

    showDetail(data, status) {
        if (status == 0)
            this.isInspect = true;
        else if (status == 1)
            this.isInspect = false;
        this.templateObj = JSON.parse(data.templateJson);
        this.inspectColumnNum = this.templateObj[0].length;
        this.inspectVisible = true;
        this.nowData = data;
    }

    addRowWhenInspect() {
        this.templateObj.push(this.getInspectRow(this.templateObj.length));
    }

    AddColumnWhenInspect() {
        this.inspectColumnNum++;

        this.templateObj.forEach((row) => {
            let num = this.inspectColumnNum - row.length;
            for (let i = 0; i < num; i++) {
                row.push({cellvalue: ' '});
            }
        })
    }

    getInspectRow(rowNum: number): any {
        let rowObj = [];
        for (let i = 0; i < this.inspectColumnNum; i++) {
            // let cellvalue = 'column' + rowNum + i;
            rowObj.push({cellvalue: ' '});
        }

        return rowObj;
    }


    startEdit(data): void {
        this.editCache[data.id].edit = true;
    }

    cancelEdit(id: string): void {
        this.editCache[id].edit = false;
        this.searchData();
    }

    saveEdit(id: string): void {
        let data = this.editCache[id].data;
        console.log(data);
        this.riskTempConfigService.editTemplate(data)
            .subscribe((response) => {
                this.editCache[id].edit = false;
                this.searchData();
                this.nzMessageService.success("修改成功！")
            }, (error) => {
                this.nzMessageService.error('修改失败！');
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

    compareFn = (o1: any, o2: any) => {
        return o1 && o2 ? o1.id === o2.id : o1 === o2
    };

}

