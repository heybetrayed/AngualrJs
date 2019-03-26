import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {SERVER_API_URL} from "../../app.constants";
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DataTablesResponse} from '../../shared/data-tables-response';
import {HttpClient} from '@angular/common/http';
import {DataTableDirective} from 'angular-datatables';
import {systemDto} from "./systemDto";
import {SystemService} from "./system.service";

declare var $: any;
declare var jQuery: any;
declare var swal: any;

@Component({
    selector: 'cat-page',
    templateUrl: 'system.component.html',
    styleUrls: ['system.component.css']
})

export class SystemComponent implements OnInit {
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    @ViewChild('content') content: TemplateRef<any>;
    dtOptions: DataTables.Settings = {};
    mr: NgbModalRef;
    saveForm: FormGroup;
    searchForm: FormGroup;
    systemDto: systemDto;
    systemId: string = '';

    constructor(private fb: FormBuilder,
                private http: HttpClient,
                private modalService: NgbModal,
                private systemService: SystemService,) {
        this.searchForm = this.fb.group({
            name: '',
            status: '',

        })
    }

    search() {
        this.clearParam();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
    }

    ngOnInit() {

        //表单验证
        this.saveForm = this.fb.group({
            id: [],
            icon: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(36)]],
            banner: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(36)]],
            theme: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(36)]],
            basepath: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(36)]],
            name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(36)]],
            title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(36)]],
            description: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(36)]],
            status:['', [Validators.required,]]
        });

        const that = this;
        this.dtOptions = {
            searching: false,
            serverSide: true,
            processing: true,
            ajax: (dataTablesParameters: any, callback) => {
                that.http.post<DataTablesResponse>(
                    SERVER_API_URL + 'uaa/api/applicationsPages' + '?draw=' + dataTablesParameters.draw + '&start=' + dataTablesParameters.start + '&length=' + dataTablesParameters.length,
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
               /* title: '编号',
                data: 'id'
            }, {*/
                title: '图标',
                data: 'icon'
            }, {
                title: '背景',
                data: 'banner'
            }, {
                title: '主题',
                data: 'theme'
            }, {
                title: '根目录',
                data: 'basepath'
            }, {
                title: '系统名称',
                data: 'name'
            }, {
                title: '系统标题',
                data: 'title'
            }, {
                title: '系统描述',
                data: 'description'
            }, {
                title: '创建时间',
                data: 'ctime'
            }, {
                title: '状态',
                data: 'status',
                render: function (data, type, row) {
                    if (data == 0) {
                        return '禁用';
                    } else{
                        return '启用';
                    }

                }
            }],
            rowCallback(row: Node, data: any[] | Object, index: number) {
                $('td', row).unbind('click');
                $('td', row).bind('click', function () {
                    that.someClick(data);
                    $('td', row).parent().siblings().removeAttr("style");
                    $('td', row).parent().css("background", "#868e96");
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


    showAddModal() {
        this.saveForm.reset();
        this.mr = this.modalService.open(this.content);
    }

    //获取绑定事件
    someClick(info: any) {
        this.systemId = info.id;
    }

    //清空id
    clearParam() {
        this.systemId = '';
    }

    /*-------------------------------编辑-------------------------------------*/
    getSystemById(systemId) {
        if (systemId != '' || systemId != null) {
            this.systemService.getSystem(systemId).subscribe((response) => this.onGetSystemSuccess(response.body), () => this.onGetSystemError());
        } else {
            this.errorSwal('请先选中一行');
        }
    }

    // 获取用户成功  渲染到编辑页面  打开编辑页面
    private onGetSystemSuccess(result) {
        this.saveForm.setValue({
            'id': result.id,
            'icon': result.icon,
            'banner': result.banner,
            'theme': result.theme,
            'basepath': result.basepath,
            'name': result.name,
            'title': result.title,
            'description': result.description,
            'status' :result.status,
        });

        this.mr = this.modalService.open(this.content);
    }


    private onGetSystemError() {
        this.errorSwal('获取失败');
    }

    /*-------------------------------保存-------------------------------------*/
    saveSystem() {
        this.systemDto = this.saveForm.value;

        if (this.saveForm.value.id == null) {
            this.systemService.create(this.systemDto).subscribe((response) => this.onSaveSuccess(response), () => this.onSaveError());
        } else {
            this.systemService.edit(this.systemDto).subscribe((response) => this.onEditSuccess(response), () => this.onEditError());
        }
    }


    private onSaveSuccess(result) {
        //关闭modal
        this.mr.dismiss('cancel');
        this.successSwal('保存成功');
        //保存成功，刷新表单
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
    }

    private onSaveError() {
        this.errorSwal('保存失败');
    }


    private onEditSuccess(result) {
        //关闭modal
        this.mr.dismiss('cancel');
        this.successSwal('更新成功');
        this.clearParam();
        //保存成功，刷新表单
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
    }

    private onEditError() {
        this.errorSwal('更新失败');
    }


    /*-------------------------------提示信息-----------------------------*/

    //错误提示
    private errorSwal(message) {
        swal({
            title: message,
            type: "error",
            confirmButtonClass: "btn-danger",
            confirmButtonText: "确认"
        });
    }

    //正确提示
    private successSwal(message) {
        swal({
            title: message,
            type: "success",
            confirmButtonClass: "btn-success",
            confirmButtonText: "确认"
        });
    }


}
