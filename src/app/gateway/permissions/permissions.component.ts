import {Component, ViewChild} from '@angular/core';
import {jqxTreeComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxtree';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PermissionsService} from './permissions.service';
import {permissionDto} from './permissionDto';


declare var swal: any;

@Component({
    selector: 'cat-page',
    templateUrl: 'permissions.component.html',
    styleUrls: ['permissions.component.css']
})

export class PermissionsComponent {
    //声明提交表单
    saveForm: FormGroup;
    //显示增加模块页面
    showAdd: boolean = false;
    //所有系统
    systems: any;
    //显示树
    showPermission: boolean = false;
    //加载树默认值（权限）
    systemId: string = '0';
    //权限DTO
    permissionDto: permissionDto;
    //判断是否下个模块
    nextFlag: boolean = false;
    //显示上级模块
    perantIdFlag: boolean = false;

    @ViewChild('myTree') myTree: jqxTreeComponent;

    constructor(private fb: FormBuilder,
                private permissionsService: PermissionsService) {}
    /*-------------------------------加载树-----------------------------*/
    source = {
        datatype: 'json',
        datafields: [
            {name: 'id'},
            {name: 'pId'},
            {name: 'name'},
        ],
        id: 'id',
        url: this.permissionsService.getPermissionByAppIdUrl(this.systemId),
        //异步加载
        async: false
    };
    dataAdapter = new jqx.dataAdapter(this.source, {autoBind: true});
    records: any = this.dataAdapter.getRecordsHierarchy('id', 'pId', 'items', [{name: 'name', map: 'label'}]);


    ngOnInit(): void {

        //查询所有系统
        this.permissionsService.getAllApplications().subscribe((response) => {
            this.systems = response.body;
        });
        //表单验证
        this.saveForm = this.fb.group({
            id: [],
            parent: [],
            name: ['', [Validators.required]],
            permissionValue: [],
            uri: [],
        });

    }
    /*-------------------------------显示对应的权限-----------------------------*/
    getPermission(systemId) {
        this.systemId = systemId;
        this.source.url = this.permissionsService.getPermissionByAppIdUrl(this.systemId);
        this.dataAdapter = new jqx.dataAdapter(this.source, {autoBind: true});
        this.records = this.dataAdapter.getRecordsHierarchy('id', 'pId', 'items', [{name: 'name', map: 'label'}]);
        this.showPermission = true;
        this.showAdd = false;
    }
    /*-------------------------------显示模块-----------------------------*/
    showModual() {
        this.saveForm.reset();
        this.showAdd = true;
        this.perantIdFlag = false;
    }
    /*-------------------------------显示下级模块-----------------------------*/
    showNextModual() {
        this.saveForm.reset();
        //选中的模块信息
        let selectedItem = this.myTree.getSelectedItem();
        if (selectedItem == null) {
            this.errorSwal('请选择上级模块');
        } else {
            this.saveForm.setValue({
                'id': '',
                'parent': selectedItem.label,
                'name': '',
                'permissionValue': '',
                'uri': '',
            });
            this.showAdd = true;
            this.perantIdFlag = true;
            this.nextFlag = true;
        }

    }
    /*-------------------------------选中模块-----------------------------*/
    myTreeOnSelect(event: any): void {
        //选中权限获取Id  根据Id查询对应权限 然后渲染页面
        let args = event.args;
        // let item =this.myTree.getItem(event.args.element);
        //选中的模块信息
        let selectedItem = this.myTree.getSelectedItem();
        //选中的上级模块信息
        let parentItem = this.myTree.getItem(selectedItem.parentElement);
        if (parentItem == null) {
            this.permissionsService.getPermissionById(args.element.id).subscribe((response) => {
                this.saveForm.setValue({
                    'id': response.body.id,
                    'parent': null,
                    'name': response.body.name,
                    'permissionValue': response.body.permissionValue,
                    'uri': response.body.uri,
                });
            });
            this.perantIdFlag = false;
        } else {
            this.permissionsService.getPermissionById(args.element.id).subscribe((response) => {
                this.saveForm.setValue({
                    'id': response.body.id,
                    'parent': parentItem.label,
                    'name': response.body.name,
                    'permissionValue': response.body.permissionValue,
                    'uri': response.body.uri,
                });
            });
            this.perantIdFlag = true;
        }

        this.showAdd = true;
    }

    /*-------------------------------保存模块-----------------------------*/
    saveModual() {
        //页面选中元素
        let selectedItem = this.myTree.getSelectedItem();
        //表单赋值
        this.permissionDto = this.saveForm.value;
        //状态赋值
        this.permissionDto.status = 0;
        //所属系统赋值
        this.permissionDto.applicationId = this.systemId;
        //判断新增是一级模块还是下级模块
        if (this.saveForm.value.parent == null || typeof (this.saveForm.value.parent) == 'undefined') {
            this.permissionDto.pId = 0;
            this.permissionDto.type = 1;
            this.permissionDto.icon = 'icmn-users';
        } else {
            //判断更新是一级模块还是下级模块
            if (selectedItem.parentElement == null) {
                this.permissionDto.pId = selectedItem.element.id;
            } else {
                if (this.nextFlag) {
                    this.permissionDto.pId = selectedItem.element.id;
                } else {
                    let parentItem = this.myTree.getItem(selectedItem.parentElement);
                    this.permissionDto.pId = parentItem.element.id;
                }
            }
            this.permissionDto.icon = 'icmn-clock';
            this.permissionDto.type = 2;
        }
        if (this.saveForm.value.id == null || this.saveForm.value.id == '') {
            this.permissionsService.create(this.permissionDto).subscribe(() => {
                this.getPermission(this.systemId);
                this.showAdd = false;
                this.nextFlag = false;
                this.successSwal('保存成功');
            }, () => {
                this.errorSwal('保存失败');
            });
        } else {
            this.permissionsService.edit(this.permissionDto).subscribe(() => {
                this.getPermission(this.systemId);
                this.showAdd = false;
                this.successSwal('更新成功');
            }, () => {
                this.errorSwal('更新失败');
            });
        }
    }

    /*-------------------------------删除模块-----------------------------*/
    deleteModual() {
        let selectedItem = this.myTree.getSelectedItem();
        if (selectedItem == null) {
            this.errorSwal('请选择删除模块');
        } else {
            const that = this;
            swal({
                    title: '是否要删除?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonClass: 'btn-danger',
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    closeOnConfirm: false,
                    closeOnCancel: true
                },
                function () {
                    if (selectedItem.element.id != null) {
                        that.permissionsService.selectPermissionById(selectedItem.element.id).subscribe((response) =>
                            that.onGetPermissionByIdSuccess(response, selectedItem.element.id), () => that.onGetPermissionByIdError());
                    }
                });
        }
    }


    private onGetPermissionByIdSuccess(result, idx) {
        if (result.json == 0) {
            this.permissionsService.delete(idx).subscribe((response) => {
                this.successSwal('删除成功');
                this.showAdd = false;
                this.getPermission(this.systemId);
            }, () => {
                this.successSwal('删除失败');
                this.getPermission(this.systemId);
            });
        } else {
            this.errorSwal('请先解除该权限对应的角色关系');
        }
    }

    private onGetPermissionByIdError() {
        this.errorSwal('查询权限角色关系失败');
    }

    /*-------------------------------展开合并-----------------------------*/

    collapseAll() {
        this.myTree.collapseAll();
        this.showAdd = false;
    }

    expandAll() {
        this.myTree.expandAll();
        this.showAdd = false;
    }


    /*-------------------------------提示信息-----------------------------*/

    //错误提示
    private errorSwal(message) {
        swal({
            title: message,
            type: 'error',
            confirmButtonClass: 'btn-danger',
            confirmButtonText: '确认'
        });
    }

    //正确提示
    private successSwal(message) {
        swal({
            title: message,
            type: 'success',
            confirmButtonClass: 'btn-success',
            confirmButtonText: '确认'
        });
    }

}

