import {AfterViewChecked, AfterViewInit, Component, NgZone, OnChanges, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PermissionService} from './permission.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {DataTableDirective} from 'angular-datatables';
import {permissionDto} from './permissionDto';


declare var $: any;
declare var jQuery: any;
declare var swal: any;

@Component({
    selector: 'cat-page',
    templateUrl: 'permission.component.html',
    styleUrls: ['permission.component.css']
})

export class PermissionComponent implements OnInit {
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    @ViewChild('content') content: TemplateRef<any>;
    dtOptions: DataTables.Settings = {};
    searchForm: FormGroup;
    saveForm: FormGroup;
    mr: NgbModalRef;
    applicationArray: any;
    permissionArrayDto: any = new Array<permissionDto>();
    permissionDto: permissionDto;
    perantId:any;
    perantArray: any = [{'id': '', 'text': ''}];
    showFlag: boolean = false;
    modualFlag: boolean = false;
    pIdFlag: boolean = false;
    buttonFlag:boolean;

    constructor(private fb: FormBuilder,
                private modalService: NgbModal,
                private http: HttpClient,
                private permissionService: PermissionService,
    ) {

        this.searchForm = this.fb.group({
            applicationSel: []
        })
    }

    ngOnInit() {
        //加载系统
        this.getApplication();
        //表单验证
        this.saveForm = this.fb.group({
            id: [],
            name: ['', [Validators.required]],
            permissionValue: [],
            uri: [],
        });
    }

    /*-------------------------------查询系统-----------------------------*/

    getApplication() {
        this.permissionService.getApplication().subscribe((response) => {
            if (null != response.json) {
                this.applicationArray=response.json;
            }
        })

}


    /*-------------------------------获取权限-----------------------------*/
    count:number =0;
    selectPermission() {
        if(null != this.searchForm.value.applicationSel){
            this.perantArray = [];
            this.permissionService.getPermission(this.searchForm.value.applicationSel).subscribe((response) => {
                this.permissionArrayDto = new Array<permissionDto>();
                if (null != response.json) {
                    for (var i in response.json) {
                        this.permissionArrayDto.push(response.json[i]);
                        if (null == this.perantArray[i]) {
                            this.perantArray.push({'id': '', 'text': ''});
                        }
                        this.perantArray[i].id = this.permissionArrayDto[i].id;
                        this.perantArray[i].text = this.permissionArrayDto[i].name;
                    }
                }
                this.showFlag = false;
                this.modualFlag = true;
                if(++ this.count == 1){
                    this.buttonFlag=false;
                }else{
                    this.buttonFlag=true;
                }
                $(function () {
                    $('#nestable2').nestable();
                    $('.dd').nestable('collapseAll');
                });
            });
        }

    }
    /*-------------------------------保存模块-------------------------------------*/
    saveModual() {
        //表单赋值
        this.permissionDto = this.saveForm.value;
        this.permissionDto.status=0;
        //所属系统赋值
        this.permissionDto.applicationId = this.searchForm.value.applicationSel;

        //判断操作是一级模块还是下级模块
        if ($('#pId').val() == null  || typeof ($('#pId').val())== 'undefined') {
            this.permissionDto.pId = 0;
            this.permissionDto.type= 1;
        } else {
            this.permissionDto.pId = this.perantId;
            this.permissionDto.type= 2;
        }

        if (this.saveForm.value.id == null) {
            this.permissionService.create(this.permissionDto).subscribe(() =>{
                this.successSwal('保存成功');
                this.selectPermission();
            }, () => {
                this.errorSwal('保存失败');
            });
        } else {
            this.permissionService.edit(this.permissionDto).subscribe(() => {
                this.successSwal('更新成功');
                this.selectPermission();
            }, () => {
                this.errorSwal('更新失败');
            });
        }
    }


    /*-------------------------------操作模块-------------------------------------*/
    operatingModual(idx) {
        this.showFlag = true;
        this.pIdFlag = false;
        //操作页面表单赋值
        this.saveForm.setValue({
            'id': this.permissionArrayDto[idx].id,
            'name': this.permissionArrayDto[idx].name,
            'permissionValue': this.permissionArrayDto[idx].permissionValue,
            'uri': this.permissionArrayDto[idx].uri,
        });
    }

    /*-------------------------------操作下级模块-------------------------------------*/
    operatingItemModual(idx, itemIdx) {
        this.showFlag = true;
        this.pIdFlag = true;
        const that = this;
        this.perantId=that.permissionArrayDto[idx].children[itemIdx].pId;
        $(function () {
             $('#pId').val( that.permissionArrayDto[idx].name);
        })
        this.saveForm.setValue({
            'id': this.permissionArrayDto[idx].children[itemIdx].id,
            'name': this.permissionArrayDto[idx].children[itemIdx].name,
            'permissionValue': this.permissionArrayDto[idx].children[itemIdx].permissionValue,
            'uri': this.permissionArrayDto[idx].children[itemIdx].uri,
        });
    }

    /*-------------------------------新增模块-------------------------------------*/
    addedModual(idx) {
        this.saveForm.reset();
        this.showFlag = true;
        if(typeof (idx)== 'undefined'){
            this.pIdFlag = false;
        }else{
            this.pIdFlag = true;
            const that = this;
            this.perantId=that.permissionArrayDto[idx].id;
            $(function () {
                $('#pId').val( that.permissionArrayDto[idx].name);
            })
        }
    }

    /*-------------------------------删除模块------------------------------*/
    deleteModual(idx) {
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
                if (that.permissionArrayDto[idx].id != null && that.permissionArrayDto[idx].children.length == 0) {
                    that.permissionService.getPermissionById(that.permissionArrayDto[idx].id).subscribe((response) =>
                        that.onGetPermissionByIdSuccess(response, that.permissionArrayDto[idx].id), () => that.onGetPermissionByIdError());
                } else {
                    that.errorSwal('请先删除下级模块');
                }
            });
    }


    /*-------------------------------删除下级模块------------------------------*/
    deleteNestModual(idx, itemIdx) {
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
                if (that.permissionArrayDto[idx].children[itemIdx].id != null) {
                    that.permissionService.getPermissionById(that.permissionArrayDto[idx].children[itemIdx].id).subscribe((response) =>
                        that.onGetPermissionByIdSuccess(response, that.permissionArrayDto[idx].children[itemIdx].id), () => that.onGetPermissionByIdError());
                }
            });
    }

    private onGetPermissionByIdSuccess(result, idx) {
        if (result.json == 0) {
            this.permissionService.delete(idx).subscribe((response) => {
                this.successSwal('删除成功');
                this.selectPermission();
            }, () => {
                this.successSwal('删除失败');
                this.selectPermission();
            });
        } else {
            this.errorSwal('请先解除该权限对应的角色关系');
        }
    }
    private onGetPermissionByIdError() {
        this.errorSwal('查询权限角色关系失败');
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

    /*-------------------------------展开合并模块功能-----------------------------*/
    collapse() {
        $('.dd').nestable('collapseAll');
    }

    expand() {
        $('.dd').nestable('expandAll');
    }
}
