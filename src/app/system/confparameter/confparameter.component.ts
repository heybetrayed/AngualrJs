import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {SERVER_API_URL} from '../../app.constants';
import {DataTablesResponse} from '../../shared/data-tables-response';
import {DataTableDirective} from 'angular-datatables';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ConfparameterDto} from './confparameter-dto';
import {ConfparameterService} from './confparameter.service';

declare var $: any;
declare var jQuery: any;
declare var swal: any;

@Component({
    selector: 'app-confparameter',
    templateUrl: './confparameter.component.html',
    styleUrls: ['./confparameter.component.css']
})
export class ConfparameterComponent implements OnInit {
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    @ViewChild('content') content: TemplateRef<any>;
    dtOptions: DataTables.Settings = {};
    searchForm: FormGroup;
    cpId: string;
    saveForm: FormGroup;
    confparameterDto: ConfparameterDto;
    mr: NgbModalRef;
    titleName: string;


    constructor(private fb: FormBuilder, private modalService: NgbModal,
                private http: HttpClient, private confparameterService: ConfparameterService) {

        this.searchForm = this.fb.group({
            'cpIndex': '',
            'cpType': '',
            'endTime': '',
            'cpTaskName': '',
            'cpOperationType': '',
            'cpStatus': '',
        });
    }

    ngOnInit() {


        // 表单验证
        this.saveForm = this.fb.group({
            id: [],
            cpIndex: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
            /*cpType: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],*/
            cpType: [],
            endTime: [],
            cpStatus: ['', [Validators.required]],
            cpOperationType: ['', [Validators.required]],
            cpDescribe: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
            /*cpTaskName:['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],*/
            cpTaskName: [],
            cpMatchPhrase: ['', [Validators.required]],
            /*cpFilterCondition:['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],*/
            cpFilterCondition: [],
            cpEmail: ['', [Validators.required, Validators.email]],
            cpResultCheck: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]]
        });


        const that = this;
        this.dtOptions = {
            searching: false,
            serverSide: true,
            processing: true,
            ordering: false,
            ajax: (dataTablesParameters: any, callback) => {
                that.http.post<DataTablesResponse>(
                    SERVER_API_URL + 'systemoperation/api/getAllConfParameters' + '?draw=' + dataTablesParameters.draw + '&start=' +
                    dataTablesParameters.start + '&length=' + dataTablesParameters.length,
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
                title: '索引名称',
                data: 'cpIndex'
            }, {
                title: '类型名称',
                data: 'cpType'
            }, {
                title: '查询时间',
                data: 'endTime'
            }, {
                title: '任务名称',
                data: 'cpTaskName'
            }, /*{
              title: '过滤条件',
              data: 'cpFilterCondition'
          },*/ {
                title: '操作类型',
                data: 'cpOperationType',
                render: function (data, type, row) {
                    if (data === 0) {
                        return '自动';
                    } else {
                        return '手动';
                    }
                },
            }, {
                title: '短语精准匹配',
                data: 'cpMatchPhrase',
                render: function (data, type, row) {
                    if (data === 0) {
                        return '禁用';
                    } else {
                        return '使用';
                    }
                },
            }, {
                title: '状态',
                data: 'cpStatus',
                render: function (data, type, row) {
                    if (data === 0) {
                        return '禁用';
                    } else {
                        return '启用';
                    }
                },
            }, {
                title: '创建人',
                data: 'createBy'
            }, {
                title: '创建时间',
                data: 'createDate',
                render: function (data, type, row) {
                    return that.getFomateDate(data);
                }
            }
            ],
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
        // 清空id
        this.cpId = '';
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.draw();
        });
    }


    // 弹出新增窗口
    showAddModal(result) {
        this.titleName = '编辑';
        if (result) {
            this.titleName = '新增';
            // 重置
            this.saveForm.reset();

        }
        this.mr = this.modalService.open(this.content);
    }

    // 保存
    saveConfparameter() {
        this.confparameterDto = this.saveForm.value;
        this.confparameterService.edit(this.confparameterDto).subscribe(
            (response) => this.onSaveSuccess(response.body, this.saveForm.value.id),
            () => this.onSaveError());

    }

    getOne(cpId) {
        if (cpId !== '') {
            this.confparameterService.getOne(cpId).subscribe(
                (response) => this.onGetConfparameterSuccess(response.body),
                () => this.onGetError('获取配置参数'));
        } else {
            this.onSelectOne();
        }

    }

    // get 获取成功
    private onGetConfparameterSuccess(result) {
        this.saveForm.setValue({
            'id': result.json.id,
            'cpIndex': result.json.cpIndex,
            'cpType': result.json.cpType,
            'cpTaskName': result.json.cpTaskName,
            'cpFilterCondition': result.json.cpFilterCondition,
            'cpMatchPhrase': result.json.cpMatchPhrase,
            'cpOperationType': result.json.cpOperationType,
            'cpStatus': result.json.cpStatus,
            'cpDescribe': result.json.cpDescribe,
            'cpEmail': result.json.cpEmail,
            'cpResultCheck': result.json.cpResultCheck,
            'endTime': result.json.endTime
        });

        // 弹出窗口
        this.showAddModal(false);
    }

    // get 获取失败
    private onGetError(message) {
        this.errorSwal(message + '获取失败');
    }


    private onSelectOne() {
        this.errorSwal('请先选中一行');
    }

    private onSaveSuccess(result, id) {
        // 关闭modal
        this.mr.dismiss('cancel');
        // 保存成功，刷新表单
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            if (id === '') {
                this.successSwal('成功');
            } else {
                this.successSwal('成功');
            }
            this.cpId = '';
            dtInstance.ajax.reload();

        });
    }


    private onSaveError() {
        // 关闭modal
        this.mr.dismiss('cancel');
        this.errorSwal('失败');
    }

    // 错误提示
    private errorSwal(message) {
        swal({
            title: message,
            type: 'error',
            confirmButtonClass: 'btn-danger',
            confirmButtonText: '确认'
        });
    }

    // 正确提示
    private successSwal(message) {
        swal({
            title: message,
            type: 'success',
            confirmButtonClass: 'btn-success',
            confirmButtonText: '确认'
        });
    }

    // 获取绑定事件
    someClick(info: any) {
        this.cpId = info.id;
    }

    // 将时间戳格式化
    private getFomateDate(time) {
        if (typeof(time) === 'undefined') {
            return '';
        }

        // 最后拼接时间
        const oDate = new Date(time),
            oYear = oDate.getFullYear(),
            oMonth = oDate.getMonth() + 1,
            oDay = oDate.getDate(),
            oHour = oDate.getHours(),
            oMin = oDate.getMinutes(),
            oSen = oDate.getSeconds(),
            oTime = oYear + '-' + this.getzf(oMonth) + '-' + this.getzf(oDay) + ' ' +
                this.getzf(oHour) + ':' + this.getzf(oMin) + ':' + this.getzf(oSen);

        return oTime;
    };


    // 补0操作,当时间数据小于10的时候，给该数据前面加一个0
    private getzf(num) {
        if (parseInt(num, 10) < 10) {
            num = '0' + num;
        }
        return num;
    }
}
