import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {SERVER_API_URL} from '../../app.constants';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DataTablesResponse} from '../../shared/data-tables-response';
import {HttpClient} from '@angular/common/http';
import {DataTableDirective} from 'angular-datatables';
import {roleDto} from './roleDto';
import {RoleService} from './role.service';

declare var $: any;
declare var jQuery: any;
declare var swal: any;

@Component({
    selector: 'cat-page',
    templateUrl: 'role.component.html',
    styleUrls: ['role.component.css']
})

export class RoleComponent implements OnInit {
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    @ViewChild('content') content: TemplateRef<any>;
    @ViewChild('permission') permission: TemplateRef<any>;
    dtOptions: DataTables.Settings = {};
    mr: NgbModalRef;
    roleSaveForm: FormGroup;
    searchForm: FormGroup;
    permissionUpdateForm: FormGroup;
    roleDto: roleDto;
    roleId: string = '';

    // applicationDTO:ApplicationDTO;
    //
    // applicationsArray: any = [{'id': '', 'text': ''}];
    // applicationsArray2: any = [];


    constructor(private fb: FormBuilder,
                private http: HttpClient,
                private modalService: NgbModal,
                private roleService: RoleService,) {
        this.searchForm = this.fb.group({
            title: '',
        })
    }

    ngOnInit() {
        // this.getApplications();
        //表单验证
        this.roleSaveForm = this.fb.group({
            id: [],
            name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(36)]],
            title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(36)]],
            description: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(36)]]

        });
        this.permissionUpdateForm = this.fb.group({});

        const that = this;
        this.dtOptions = {
            searching: false,
            serverSide: true,
            processing: true,
            ajax: (dataTablesParameters: any, callback) => {
                that.http.post<DataTablesResponse>(
                    SERVER_API_URL + 'uaa/api/authorityPages' + '?draw=' + dataTablesParameters.draw + '&start=' + dataTablesParameters.start + '&length=' + dataTablesParameters.length,
                    this.searchForm.value, {}
                ).subscribe(resp => {
                    callback({
                        recordsTotal: resp.recordsTotal,
                        recordsFiltered: resp.recordsFiltered,
                        data: resp.data
                    });
                });
            },
            columns: [{
                title: '角色编码',
                data: 'name'
            }, {
                title: '角色名称',
                data: 'title'
            }, {
                title: '角色说明',
                data: 'description'
            // },{
            //     title: '角色拥有系统',
            //     data: 'applications',
            //     render: function (data, type, row) {
            //         if ('' == data) {
            //             return '';
            //         }
            //         var b = '';
            //         for (var a in data) {
            //             b += data[a].description + "    "
            //         }
            //         return b;
            //     }
            }, {
                title: '创建时间',
                data: 'ctime'
            }],
            rowCallback(row: Node, data: any[] | Object, index: number) {
                $('td', row).unbind('click');
                $('td', row).bind('click', function () {
                    that.someClick(data);
                    $('td', row).parent().siblings().removeAttr('style');
                    $('td', row).parent().css('background', '#868e96');
                });
                return row;
            },
            language: {
                'emptyTable': '没有数据',
                'loadingRecords': '加载中...',
                'processing': '查询中...',
                'search': '搜索:',
                'lengthMenu': '每页 _MENU_ 条',
                'zeroRecords': '没有数据',
                'info': '第 _START_ 条 到 _END_ 条/共有 _TOTAL_ 条',
                'infoEmpty': '没有数据',
                'infoFiltered': '(过滤总件数 _MAX_ 条)',
                'paginate': {
                    'first': '第一页',
                    'last': '最后一页',
                    'next': '下一页',
                    'previous': '上一页',
                }
            }
        };
    }

    search() {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
    }

    showAddModal() {
        this.roleSaveForm.reset();
        // this.applicationsArray2 = [];
        // const that = this;
        // $(function () {
        //     $('#applicationsId').select2({data: that.applicationsArray});
        //     $('#applicationsId').val(that.applicationsArray2).trigger('change');
        //     $('.select2').select2();
        //     $('.select2-tags').select2({tags: true, tokenSeparators: [',', ' ']});
        //     $('.selectpicker').selectpicker();
        // });
        this.mr = this.modalService.open(this.content);
    }

    /*-------------------------------保存用户-------------------------------------*/
    saveRole() {
        this.roleDto = this.roleSaveForm.value;
        // var applicationsData = $('#applicationsId').select2('data');
        // this.roleDto.applications = new Array<ApplicationDTO>();
        // for (var i in applicationsData) {
        //     this.applicationDTO = new ApplicationDTO();
        //     this.applicationDTO.id = applicationsData[i].id;
        //     this.roleDto.applications[i] = this.applicationDTO;
        // }
        if (this.roleSaveForm.value.id == null) {
            this.roleService.createRole(this.roleDto).subscribe((response) => this.onSaveSuccess(response.body), () => this.onSaveError());
        } else {
            this.roleService.editRole(this.roleDto).subscribe((response) => this.onEditSuccess(response.body), () => this.onEditError());
        }
    }


    private onSaveSuccess(result) {
        //关闭modal
        this.mr.dismiss('cancel');
        this.successSwal('保存成功');
        // this.applicationsArray2 = [];
        //保存成功，刷新表单
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });

    }


    private onSaveError() {

    }

    private onEditSuccess(result) {
        //关闭modal
        this.mr.dismiss('cancel');
        this.successSwal('编辑成功');
        // this.applicationsArray2 = [];
        this.clearParam();
        //保存成功，刷新表单
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });

    }


    private onEditError() {

    }


    //获取绑定事件
    someClick(info: any) {
        this.roleId = info.id;
    }

    //清空id
    clearParam() {
        this.roleId = '';
    }

    /*-------------------------------编辑-------------------------------------*/
    getRoleById(roleId) {
        if (roleId != '') {
            //根据userId查出用户信息
            this.roleService.getRole(roleId).subscribe((response) => this.onGetRoleSuccess(response.body), () => this.onGetRoleError());
        } else {
            this.errorSwal('请先选中一行');
        }
    }

    // 获取用户成功  渲染到编辑页面  打开编辑页面
    private onGetRoleSuccess(result) {
        this.roleSaveForm.setValue({
            'id': result.id,
            'name': result.name,
            'title': result.title,
            'description': result.description,
        });

        this.mr = this.modalService.open(this.content);
    }


    private onGetRoleError() {
        this.errorSwal('获取用户失败');
    }


    /*-------------------------------查询系统名称-----------------------------*/
    // getApplications() {
    //     this.roleService .getApplications().subscribe((response) => {
    //         if (null != response.json) {
    //             for (var i in response.json) {
    //                 if (null == this.applicationsArray[i]) {
    //                     this.applicationsArray.push({'id': '', 'text': ''});
    //                 }
    //                 this.applicationsArray[i].id = response.json[i].id;
    //                 this.applicationsArray[i].text = response.json[i].description;
    //             }
    //         }
    //     }, () => {
    //         this.errorSwal("获取系统失败");
    //     });
    // }


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
