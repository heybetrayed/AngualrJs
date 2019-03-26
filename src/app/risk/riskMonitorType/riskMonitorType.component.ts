import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {RiskMonitorTypeDTO} from './riskMonitorTypeDTO';
import {RiskMonitorTypeService} from './riskMonitorType.service';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {OrganizationService} from '../../gateway/organization/organization.service';

@Component({
    selector: 'app-riskMonitorType',
    templateUrl: './riskMonitorType.component.html',
    styleUrls: ['./riskMonitorType.component.css'],
})
export class RiskMonitorTypeComponent implements OnInit {

    mr: NgbModalRef;
    searchForm: FormGroup;
    searchItemForm: FormGroup;
    riskMonitorTypeDTO: RiskMonitorTypeDTO;
    saveMonitorTypeForm: FormGroup;

    // 搜索数据
    pageIndex = 1;
    pageSize = 10;
    loading = true;
    sortValue = null;
    sortKey = null;
    total = 1;
    monitorTypeAll: any;
    selectedValue = null;

    indeterminate = false;
    disabledButton = true;
    operating = false;
    allChecked = false;
    riskMonitorDetailAll = [];
    isVisibleAddDetail = false;
    organizations: any;
    groups: any;
    // 新建因素时选择部门
    selectedOrganization = null;
    selectedGroup = null;
    //用来存放数据和该行状态
    editCache = {};
    monitorId = -1;
    /*btnFlag = 0;*/

    constructor(
        private fb: FormBuilder,
        private modalService: NzModalService,
        private organizationService: OrganizationService,
        private riskMonitorTypeService: RiskMonitorTypeService,
        private nzMessageService: NzMessageService
    ) {
        this.searchForm = this.fb.group({
            name: '',
            status: ''
        })
        this.searchItemForm = this.fb.group({
            mTypeName: '',
            status: ''
        })

    }

    ngOnInit() {

        this.searchData();
        /*----------------------------查询部门-------------------------*/
        this.organizationService.getOrganizations()
            .subscribe((response) => {
                this.organizations = response.body;
            });
        /*----------------------------查询组别-------------------------*/
        this.riskMonitorTypeService.getGroup()
            .subscribe((response) => {
                this.groups = response.body;

            });

        /*----------------------------保存表单验证-------------------------*/
        this.saveMonitorTypeForm = this.fb.group({
            id: [],
            name: [null, [Validators.required]],
            comment: [null, [Validators.required]],

        });

    }

    searchData(reset: boolean = false): void {
          this.riskMonitorTypeDTO= this.searchForm.value;
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

        this.riskMonitorTypeService.getAllMonitorType(this.riskMonitorTypeDTO,params).subscribe((response: any) => {
            this.loading = false;
            this.total = response.body.recordsTotal;
            this.monitorTypeAll = response.body.data;
        });

    }


    getOrganizationById(ids:string[]): any {
        if(null != ids && ids.length!=0){
            let depts = "";
            ids.forEach(mDpet => {
                for (let organization of this.organizations) {
                    if (organization.id == mDpet) {
                        depts += organization.name + " ";
                    }
                }
            });
            return depts;
        }
    }

    getGroupById(dditItemCode:string[]): any{
      /*  let mTypeGroups = dditItemCode.toString().split(",");*/
        if(null != dditItemCode && dditItemCode.length!=0){
            let groups = "";
            dditItemCode.forEach(mTypeGroup => {
                for (let group of this.groups) {
                    if (group.dditItemCode == mTypeGroup) {
                        groups += group.dditItemName + " ";
                    }
                }
            });
            return groups;
        }
    }

    /*-------------------弹出新增页面------------------------*/
    isVisible = false;

    showAddMonitorType() {
        this.saveMonitorTypeForm.reset();
        this.isVisible = true;
    }

    handleCancel(): void {
        this.isVisible = false;
    }

    AddDetail() {
        let itemId = this.riskMonitorDetailAll.length + 1;

        let newSort = 1;
        if(this.riskMonitorDetailAll.length!=0){
             newSort = this.riskMonitorDetailAll[this.riskMonitorDetailAll.length-1].sort + 1;
        }
        let item = {
            id: itemId,
            mTypeName: '',
            mTypeDeptId: [],
            mTypeGroup: [],
            status: '0',
            pid: '',
            edit: true,
            child: [],
            expand: false,
            pObj:null,
            btnFlag:'add',
            sort: newSort,
            showTab:1
        };

        this.riskMonitorDetailAll = [...this.riskMonitorDetailAll, item];

    }

    deleteMonitorTypeDetail(data) {
        this.riskMonitorTypeService.getChilds(data.id).subscribe((response) => {
            if (response.body.length != 0) {
                this.nzMessageService.warning("请先删除子节点！")
            } else {
                this.riskMonitorTypeService.deleteMonitorTypeDetail(data.id).subscribe((response) => {
                        if(null == data.pObj){
                            this.riskMonitorDetailAll = this.riskMonitorDetailAll.filter(node => node !== data);
                        }else{
                            let parentChild = data.pObj.child;
                            data.pObj.child = parentChild.filter(node => node !== data);
                        }

                    this.nzMessageService.success("删除成功！")
                }, (error) => {
                        this.nzMessageService.error('删除失败！');
                    })
            }
        })


    }

    addMonitorTypeDetail(data: any) {
        let itemId = data.child.length + 1;
        let newSort = 1;
        if(data.child.length!=0){

            newSort = data.child[data.child.length-1].sort + 1;
        }
        let item = {
            id: itemId,
            mTypeName: '',
            mTypeDeptId: [],
            mTypeGroup: [],
            status: '0',
            pid: data.id,
            edit: true,
            child: [],
            expand: false,
            pObj:data,
            btnFlag:'add',
            sort:newSort,
            showTab:1
        };
        data.child = [...data.child, item];
        data.expand = true;
    }

    resetSaveMonitorTypeForm(): void {
        this.saveMonitorTypeForm.reset();
    }

    /*-------------------弹出编辑页面------------------------*/
    editMonitorType(monitorTypeId) {
        this.riskMonitorTypeService.getMonitorById(monitorTypeId).subscribe((response) => {
            this.saveMonitorTypeForm.setValue({
                id: response.body.id,
                name: response.body.name,
                comment: response.body.comment
            });

            this.isVisible = true;
        });

    }

    // 将数据获取封装禁editCache
    // updateEditCache() {
    //     this.riskMonitorDetailAll.forEach(item => {
    //         if (!this.editCache[item.id]) {
    //             this.editCache[item.id] = {
    //                 edit: false,
    //                 data: {...item}
    //             };
    //         }
    //     });
    //
    //     console.log(this.editCache)
    // }


    // 保存详情
    saveEdit(data) {

        let dto = new RiskMonitorTypeDTO();

        if(data.btnFlag === 'edit'){
           dto.id = data.id;
        }
        dto.mTypeName = data.mTypeName;
        if(null != data.mTypeDeptId){
            dto.mTypeGroup = data.mTypeGroup.toString();
        }
        dto.pid = data.pid;
        if(null != data.mTypeDeptId){
            dto.mTypeDeptId = data.mTypeDeptId.toString();
        }
        dto.monitorTypeId = this.monitorId;
        dto.sort = data.sort;
        dto.showTab = data.showTab;

        if(dto.mTypeName == '' || dto.mTypeName == null){
            this.nzMessageService.warning("数据不完整，重新输入！")
            return false;
        }
        this.riskMonitorTypeService.saveMonitorTypeDetail(dto).subscribe((response) => {
            data.id = response.body.id;
            data.showTab = response.body.showTab;
            this.nzMessageService.success('保存成功！');

            data.edit = false;
        }, (error) => {
            this.nzMessageService.error('保存失败！');
        })
    }

    getChilds(data) {
        if (data.expand) {
            this.riskMonitorTypeService.getChilds(data.id).subscribe((response) => {
                if (response.body.length != 0) {
                    data.child = response.body;
                    data.child.forEach(childern => {
                        childern.pObj = data;
                    })
                }
            })
        }
    }


    //新增详情数据
    showAddDetail() {
        this.isVisibleAddDetail = true;
    }

    editMonitorTypeDetail(data: any) {
        if(null != data.showTab){
            data.showTab = data.showTab.toString();
        }
        data.edit = true;
        data.btnFlag = 'edit';

    }

    cancelEdit(data: any): void {
       console.log(data)
       if(data.btnFlag == 'edit'){
           data.edit = false;
       }else{
           //删除该对话框
           if(null == data.pObj){
               this.riskMonitorDetailAll = this.riskMonitorDetailAll.filter(node => node!== data);
           }else{
               let parentChild = data.pObj.child;
               data.pObj.child = parentChild.filter(node => node !== data);
           }
       }

    }

    isVisibleItem = false;

    findMonitorType(monitorTypeId) {
        this.riskMonitorTypeService.getMonitorTypeById(monitorTypeId).subscribe((response) => {
            this.riskMonitorDetailAll = response.body;
        });
        this.monitorId = monitorTypeId;
        this.isVisibleItem = true;
    }

    handleCancelItem(): void {
        this.isVisibleItem = false;
    }

    saveMonitorType() {
        this.riskMonitorTypeDTO = this.saveMonitorTypeForm.value;
        if (this.saveMonitorTypeForm.value.id == null || this.saveMonitorTypeForm.value.id == '') {
            this.riskMonitorTypeService.saveMonitorType(this.riskMonitorTypeDTO).subscribe((response: any) => {
                this.nzMessageService.success('新增监控类型成功！');
                this.searchData();
                this.isVisible = false;
            });
        } else {
            this.riskMonitorTypeService.updateMonitorType(this.riskMonitorTypeDTO).subscribe((response: any) => {
                this.nzMessageService.success('更新监控类型成功！');
                this.searchData();
                this.isVisible = false;
            });
        }
    }

    // 禁用
    disable(monitorTypeId: string): void {
        this.riskMonitorTypeService.disable(monitorTypeId)
            .subscribe((response) => {
                this.searchData();
            }, (e) => this.nzMessageService.error('禁用失败!!!,<br />错误消息：' + JSON.stringify(e)));
    }

    // 启用
    enable(monitorTypeId: string): void {
        this.riskMonitorTypeService.enable(monitorTypeId)
            .subscribe((response) => {
                this.searchData();
            }, (e) => this.nzMessageService.error('启用失败!!!,<br />错误消息：' + JSON.stringify(e)));
    }

    // 批量禁用
    disableAll(): void {
        const selData = this.monitorTypeAll.filter(value => value.checked);
        const that = this;
        this.modalService.confirm({
            nzTitle: '确定禁用吗?',
          //  nzContent: '<b style="color: red;">禁用后的数据可恢复</b>',
            nzOkText: '确定',
            nzOkType: '危险',
            nzOnOk: () => {
                that.operating = true;
                setTimeout(_ => {
                    that.riskMonitorTypeService.disableAll(selData)
                        .subscribe((response) => {
                            that.searchData();
                            that.monitorTypeAll.forEach(value => value.checked = false);
                            that.refreshStatus();
                            that.operating = false;
                        }, () => that.nzMessageService.error('禁用失败！'));
                });
            },
            nzCancelText: '取消',
            nzOnCancel: () => {
                that.operating = false;
            },
        });
    }

    // 全选
    checkAll(value: boolean): void {
        this.monitorTypeAll.forEach(data => data.checked = value);
        this.refreshStatus();
    }

    // checkbox - 刷新
    refreshStatus(): void {
        const allChecked = this.monitorTypeAll.every(value => value.checked === true);
        const allUnChecked = this.monitorTypeAll.every(value => !value.checked);
        this.allChecked = allChecked;
        this.indeterminate = (!allChecked) && (!allUnChecked);
        this.disabledButton = !this.monitorTypeAll.some(value => value.checked);
    }

    clearSearchSet() {
        this.searchForm.reset();
        this.searchData();
    }


}
