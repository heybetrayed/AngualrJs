import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {SERVER_API_URL} from '../../app.constants';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DataTablesResponse} from '../../shared/data-tables-response';
import {DataTableDirective} from 'angular-datatables';
import {HttpClient} from '@angular/common/http';
import {UserService} from './user.service';
import {UserDto} from './UserDto';


declare var $: any;
declare var jQuery: any;
declare var swal: any;

@Component({
    selector: 'cat-page',
    templateUrl: 'user.component.html',
    styleUrls: ['user.component.css']
})

export class UserComponent implements OnInit {
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    @ViewChild('content') content: TemplateRef<any>;
    @ViewChild('bpmnContent') bpmnContent: TemplateRef<any>;
    dtOptions: DataTables.Settings = {};
    saveForm: FormGroup;
    searchForm: FormGroup;
    mr: NgbModalRef;
    userDto: UserDto;
    userId: string = '';
    authority: any;
    authorityArray: any = [{'id': '', 'text': ''}];
    authorityArray2: any = [];
    organizationsArray: any = [{'id': '', 'text': ''}];
    organizationsArray2: any = [];
    statusBoolean: boolean = true;
    userLogin: string = '';

    constructor(private fb: FormBuilder,
                private modalService: NgbModal,
                private http: HttpClient,
                private userService: UserService,) {
        this.searchForm = this.fb.group({
            firstName: '',
            activated: '',
            authority: ''
        })
    }

    ngOnInit() {
        this.getAuthorities();
        this.getOrganizations();
        this.getUserLogin();
        // 表单验证
        this.saveForm = this.fb.group({
            id: [],
            login: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(36)]],
            firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(36)]],
            email: ['', [Validators.required]],
            activated: [],
            passWord: []
        })
        const that = this;
        this.dtOptions = {
            searching: false,
            serverSide: true,
            processing: true,
            ordering: false,
            ajax: (dataTablesParameters: any, callback) => {
                that.http.post<DataTablesResponse>(
                    SERVER_API_URL + 'uaa/api/userPages' + '?draw=' + dataTablesParameters.draw + '&start=' + dataTablesParameters.start + '&length=' + dataTablesParameters.length,
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
                title: '用户账号',
                data: 'login'
            }, {
                title: '用户姓名',
                data: 'firstName'
            }, {
                title: '用户邮箱',
                data: 'email'
            }, {
                title: '所属部门',
                data: 'organizationObjs',
                render: function (data, type, row) {
                    if ('' == data) {
                        return '';
                    }
                    return data[0].name;
                }
            }, {
                title: '角色编码',
                data: 'authoritieObjs',
                render: function (data, type, row) {
                    if ('' == data) {
                        return '';
                    }
                    var b = '';
                    for (var a in data) {
                        b += data[a].name + '    '
                    }
                    return b;
                }
            }, {
                title: '角色名称',
                data: 'authoritieObjs',
                render: function (data, type, row) {
                    if ('' == data) {
                        return '';
                    }
                    var b = '';
                    for (var a in data) {
                        b += data[a].title + '    '
                    }
                    return b;
                }
            }, {
                title: '修改人',
                data: 'lastModifiedBy'
            }, {
                title: '修改时间',
                data: 'lastModifiedDate',
                render: function (data, type, row) {
                    if ('' == data) {
                        return '';
                    }
                    return that.getFomateDate(data);
                }
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

    /*-------------------------------查询-------------------------------------*/
    search() {
        this.clearParam();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
    }

    /*-------------------------------新增-------------------------------------*/
    showAddModal() {
        this.saveForm.reset();
        this.organizationsArray2 = [];
        this.authorityArray2 = [];
        const that = this;
        $(function () {
            $('#authorityId').select2({data: that.authorityArray});
            $('#authorityId').val(that.authorityArray2).trigger('change');
            $('#organizationsId').select2({data: that.organizationsArray});
            $('#organizationsId').val(that.organizationsArray2).trigger('change');
            $('.select2').select2();
            $('.select2-tags').select2({tags: true, tokenSeparators: [',', ' ']});
            $('.selectpicker').selectpicker();
            $('#loginUser').val(that.userLogin);
        });


        this.statusBoolean = false;
        this.mr = this.modalService.open(this.content);
    }

    /*-------------------------------新增-------------------------------------*/
    showBpmnModal() {
        const that = this;
        this.statusBoolean = false;
        this.mr = this.modalService.open(this.bpmnContent, {windowClass: 'modal-size-large'});
    }

    // 获取绑定事件
    someClick(info: any) {
        this.userId = info.id;
    }

    // 清空id
    clearParam() {
        this.userId = '';
    }

    /*-------------------------------编辑-------------------------------------*/
    getUserById(userId) {
        if (userId != '') {
            // 根据userId查出用户信息
            this.userService.getUser(userId).subscribe((response) => this.onGetUserSuccess(response.body), () => this.onGetUserError());
        } else {
            this.errorSwal('请先选中一行');
        }
    }

    // 获取用户成功  渲染到编辑页面  打开编辑页面
    private onGetUserSuccess(result) {
        this.saveForm.setValue({
            'id': result.id,
            'login': result.login,
            'firstName': result.firstName,
            'email': result.email,
            'activated': result.activated,
            'passWord': '',
        });

        if (null != result.organizationObjs && result.organizationObjs.length > 0) {
            this.organizationsArray2 = [];
            for (var i in result.organizationObjs) {
                if (null == this.organizationsArray2[i]) {
                    this.organizationsArray2.push('');
                }
                this.organizationsArray2[i] = result.organizationObjs[i].id;
            }
        }

        if (null != result.authoritieObjs && result.authoritieObjs.length > 0) {
            this.authorityArray2 = [];
            for (var i in result.authoritieObjs) {
                if (null == this.authorityArray2[i]) {
                    this.authorityArray2.push('');
                }
                this.authorityArray2[i] = result.authoritieObjs[i].name;
            }
        }
        const that = this;
        $(function () {
            $('#authorityId').select2({data: that.authorityArray});
            $('#authorityId').val(that.authorityArray2).trigger('change');
            $('#organizationsId').select2({data: that.organizationsArray});
            $('#organizationsId').val(that.organizationsArray2).trigger('change');
            $('.select2-tags').select2({tags: true, tokenSeparators: [',', ' ']});
            $('.selectpicker').selectpicker();
            $('#loginUser').val(that.userLogin);
        });
        this.statusBoolean = true;
        this.mr = this.modalService.open(this.content);
    }


    private onGetUserError() {
        this.errorSwal('获取用户失败');
    }


    /*-------------------------------保存用户-------------------------------------*/
    saveUser() {
        this.userDto = this.saveForm.value;
        var organizationsData = $('#organizationsId').select2('data');
        this.userDto.organizations = new Array<String>();
        for (var i in organizationsData) {
            this.userDto.organizations[i] = organizationsData[i].id;
        }
        var authoritiesData = $('#authorityId').select2('data');
        this.userDto.authorities = new Array<String>();
        for (var i in authoritiesData) {
            this.userDto.authorities[i] = authoritiesData[i].id;
        }
        if (this.saveForm.value.id == null) {
            this.userService.create(this.userDto).subscribe((response) => {
                //关闭modal
                this.mr.dismiss('cancel');
                this.authorityArray2 = [];
                this.organizationsArray2 = [];
                this.successSwal('保存成功');
                this.clearParam();
                //保存成功，刷新表单
                this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    dtInstance.ajax.reload();
                });
            }, () => {
                this.errorSwal('保存失败');
            });
        } else {
            this.userService.editUser(this.userDto).subscribe((response) => {
                //关闭modal
                this.mr.dismiss('cancel');
                this.authorityArray2 = [];
                this.organizationsArray2 = [];
                this.successSwal('更新成功');
                //清空id
                this.clearParam();
                //更新成功，刷新表单
                this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    dtInstance.ajax.reload();
                });
            }, () => {

            });
        }
    }


    /*-------------------------------查询角色名称-----------------------------*/
    getAuthorities() {
        this.userService.getAuthorities().subscribe((response) => {
            this.authority = response.body;
            if (null != response.body) {
                for (var i in response.body) {
                    if (null == this.authorityArray[i]) {
                        this.authorityArray.push({'id': '', 'text': ''});
                    }

                    this.authorityArray[i].id = response.body[i].name;
                    this.authorityArray[i].text = response.body[i].title;
                }
            }
        }, () => {
            this.errorSwal('获取角色失败');
        });
    }

    /*-------------------------------查询部门-----------------------------*/
    getOrganizations() {
        this.userService.getOrganizations().subscribe((response) => {
            if (null != response.body) {
                for (var i in response.body) {
                    if (null == this.organizationsArray[i]) {
                        this.organizationsArray.push({'id': '', 'text': ''});
                    }
                    this.organizationsArray[i].id = response.body[i].id;
                    this.organizationsArray[i].text = response.body[i].name;
                }
            }
        }, () => {
            this.errorSwal('获取部门失败');
        });
    }


    /*-------------------------------查询登录人-----------------------------*/
    getUserLogin() {
        this.userService.getUserLogin().subscribe((response) => {
            if (null != response.body) {
                this.userLogin = response.body.login;
            }
        }, () => {
            this.errorSwal('获取登录姓名失败');
        });
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

    /*-------------------------------时间戳格式化-----------------------------*/
    private getFomateDate(time) {
        if (typeof(time) == 'undefined') {
            return '';
        }
        var oDate = new Date(time),
            oYear = oDate.getFullYear(),
            oMonth = oDate.getMonth() + 1,
            oDay = oDate.getDate(),
            oHour = oDate.getHours(),
            oMin = oDate.getMinutes(),
            oSen = oDate.getSeconds(),
            oTime = oYear + '-' + this.getzf(oMonth) + '-' + this.getzf(oDay) + ' ' + this.getzf(oHour) + ':' + this.getzf(oMin) + ':' + this.getzf(oSen);//最后拼接时间

        return oTime;
    };

    //补0操作,当时间数据小于10的时候，给该数据前面加一个0
    private getzf(num) {
        if (parseInt(num) < 10) {
            num = '0' + num;
        }
        return num;
    }

    data: any;

}




