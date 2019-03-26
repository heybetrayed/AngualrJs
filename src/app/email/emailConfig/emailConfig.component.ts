import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DataTableDirective} from 'angular-datatables';
import {SERVER_API_URL} from '../../app.constants';
import {DataTablesResponse} from '../../shared/data-tables-response';
import {HttpClient} from '@angular/common/http';
import {EmailConfigDto} from './emailConfigDto';
import {EmailConfigService} from './emailConfig.service';



declare var $: any;
declare var jQuery: any;
declare var swal: any;

@Component({
    selector: 'app-emailConfig',
    templateUrl: './emailConfig.component.html',
    styleUrls: ['./emailConfig.component.css'],
})

export class EmailConfigComponent implements OnInit {
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    @ViewChild('content') content: TemplateRef<any>;
    dtOptions: DataTables.Settings = {};
    mr: NgbModalRef;
    saveForm: FormGroup;
    searchForm: FormGroup;
    emailConfigDto:EmailConfigDto;
    mailConfigId:string = '';

    constructor(private fb: FormBuilder, private http: HttpClient,
                private modalService: NgbModal,
                private emailConfigService: EmailConfigService,) {
        this.searchForm = this.fb.group({
            mailServerHost: '',
            mailUserNmae:'',
            mailStatus:'',

        })
    }


    search() {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
    }


    showAddMailConfig() {
        this.saveForm.reset();
        this.mr = this.modalService.open(this.content);
    }

    showEditMailConfig(mailConfigId){
        if (mailConfigId != '') {
            this.emailConfigService.getMailConfig(mailConfigId).subscribe((response) => {
                this.saveForm.setValue({
                    'id': response.body.id,
                    'mailServerHost': response.body.mailServerHost,
                    'mailPort': response.body.mailPort,
                    'mailUserNmae': response.body.mailUserNmae,
                    'mailPassword':response.body.mailPassword,
                    'mailStatus' :response.body.mailStatus,
                });
                this.mr = this.modalService.open(this.content);
            }, () => {
                this.errorSwal('查询失败');
            });
        } else {
            this.errorSwal('请先选中一行');
        }

    }


    /*-------------------------------保存邮件参数配置-------------------------------------*/
    saveMailConfig() {
        this.emailConfigDto = this.saveForm.value;
        if (this.saveForm.value.id == null) {
            this.emailConfigService.create(this.emailConfigDto).subscribe((response) => {
                this.successSwal('保存成功');
                //关闭modal
                this.mr.dismiss('cancel');
                //保存成功，刷新表单
                this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    dtInstance.ajax.reload();
                });
            }, () => {
                this.errorSwal('保存失败');
            });
        } else {
            this.emailConfigService.edit(this.emailConfigDto).subscribe((response) => {
                this.successSwal('更新成功');
                //清空id
                this.clearParam();
                //关闭modal
                this.mr.dismiss('cancel');
                //保存成功，刷新表单
                this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    dtInstance.ajax.reload();
                });
            }, () => {
                this.errorSwal('更新失败');
            });
        }
    }


    ngOnInit() {

        //表单验证
        this.saveForm = this.fb.group({
            id: [],
            mailServerHost: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(36)]],
            mailPort: ['', [Validators.required,]],
            mailUserNmae: ['', [Validators.required]],
            mailPassword:['', [Validators.required]],
            mailStatus:['', [Validators.required]],
        });

        const that = this;
        this.dtOptions = {
            searching: false,
            serverSide: true,
            processing: true,
            ajax: (dataTablesParameters: any, callback) => {
                that.http.post<DataTablesResponse>(
                    SERVER_API_URL + 'email/api/mailConfigs' + '?draw=' + dataTablesParameters.draw + '&start=' + dataTablesParameters.start + '&length=' + dataTablesParameters.length,
                    this.searchForm.value, {}
                ).subscribe(resp =>
                    callback({
                        recordsTotal: resp.recordsTotal,
                        recordsFiltered: resp.recordsFiltered,
                        data: resp.data
                    }));
            },
            columns: [{
                title: '编号',
                data: 'id'
            }, {
                title: '服务器地址',
                data: 'mailServerHost'
            }, {
                title: '邮件端口',
                data: 'mailPort'
            }, {
                title: '邮件用户名',
                data: 'mailUserNmae'
            }, {
                title: '邮件授权码',
                data: 'mailPassword'
            }, {
                title: '创建人',
                data: 'mailCreateBy'
            }, {
                title: '创建时间',
                data: 'mailCreateDate',
                render: function (data, type, row) {
                    return that.getFomateDate(data);
                }
            }, {
                title: '更新人',
                data: 'mailUpdateBy'
            }, {
                title: '更新时间',
                data: 'mailUpdateDate',
                render: function (data, type, row) {
                    return that.getFomateDate(data);
                }
            }, {
                title: '状态',
                data: 'mailStatus',
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

    //获取绑定事件
    someClick(info: any) {
        this.mailConfigId = info.id;
    }

    //清空id
    clearParam() {
        this.mailConfigId = '';
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


    //将时间戳格式化
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

}
