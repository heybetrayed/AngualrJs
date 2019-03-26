import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DataTableDirective} from 'angular-datatables';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {RiskTempService} from './riskTemp.service';
import {SERVER_API_URL} from '../../app.constants';
import {DataTablesResponse} from '../../shared/data-tables-response';
import {RiskTempDTO} from './riskTempDTO';


declare var $: any;
declare var swal: any;

@Component({
    selector: 'app-risk-temp',
    templateUrl: './riskTemp.component.html',
    styleUrls: ['riskTemp.component.css']
})
export class RiskTempComponent implements OnInit {


    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    @ViewChild('content') content: TemplateRef<any>;
    dtOptions: DataTables.Settings = {};
    mr: NgbModalRef;
    saveForm: FormGroup;
    searchForm: FormGroup;
    riskTempDTO: RiskTempDTO;
    riskTempId: String = '';

    constructor(private fb: FormBuilder,
                private http: HttpClient,
                private modalService: NgbModal,
                private riskTempService: RiskTempService) {

        this.searchForm = this.fb.group({
            tempName: '',
            tempStatus: '',
        })

    }

    search() {
        this.clearParam();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
    }

    // 获取绑定事件
    someClick(info: any) {
        this.riskTempId = info.id;
    }

    // 清空id
    clearParam() {
        this.riskTempId = '';
    }


    ngOnInit(): void {
        // 表单验证
        this.saveForm = this.fb.group({
            id: [],
            tempName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(36)]],
            tempType: ['', [Validators.required]],
            tempRemark: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(36)]],
            tempStatus: ['', [Validators.required]]
        });
        const that = this;
        this.dtOptions = {
            searching: false,
            serverSide: true,
            processing: true,
            ajax: (dataTablesParameters: any, callback) => {
                that.http.post<DataTablesResponse>(
                    SERVER_API_URL + 'riskapp/api/getRiskTempsPage' + '?draw=' + dataTablesParameters.draw + '&start=' +
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
                title: '模板名称',
                data: 'tempName'
            }, {
                title: '模板类型',
                data: 'tempType'
            }, {
                title: '模板说明',
                data: 'tempRemark',
            }, {
                title: '模板创建时间',
                data: 'createDate',
                render: function (data, type, row) {
                    return that.getFomateDate(data);
                }
            }, {
                title: '模板创建人',
                data: 'createBy',
            }, {
                title: '模板状态',
                data: 'tempStatus',
                render: function (data, type, row) {
                    if (data === 0) {
                        return '禁用';
                    } else {
                        return '启用';
                    }
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

    showAddTemp() {
        this.saveForm.reset();
        this.mr = this.modalService.open(this.content);
    }

    /*-------------------------------编辑-------------------------------------*/
    getRiskTempById(riskTempId) {
        if (riskTempId !== '') {
            this.riskTempService.getRiskTemp(riskTempId).subscribe((response) => {
                this.saveForm.setValue({
                    'id': response.body.id,
                    'tempName': response.body.tempName,
                    'tempType': response.body.tempType,
                    'tempStatus': response.body.tempStatus,
                    'tempRemark': response.body.tempRemark,
                });
                this.mr = this.modalService.open(this.content);
            }, () => {
                this.errorSwal('获取模板失败');
            });
        } else {
            this.errorSwal('请先选中需要编辑的数据');
        }
    }


    /*-------------------------------保存-------------------------------------*/
    saveRiskTemp() {
        this.riskTempDTO = this.saveForm.value;
        if (this.saveForm.value.id == null || this.saveForm.value.id == '') {
            this.riskTempService.createRiskTemp(this.riskTempDTO).subscribe((response) => {
                // 关闭modal
                this.mr.dismiss('cancel');
                this.successSwal('保存成功');
                // 保存成功，刷新表单
                this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    dtInstance.ajax.reload();
                });
            }, () => {
                this.errorSwal('保存失败');
            });
        } else {
            this.riskTempService.updateRiskTemp(this.riskTempDTO).subscribe((response) => {
                // 关闭modal
                this.mr.dismiss('cancel');
                this.successSwal('编辑成功');
                this.clearParam();
                //保存成功，刷新表单
                this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    dtInstance.ajax.reload();
                });
            }, () => {
                this.errorSwal('编辑失败');
            });
        }
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

    // 将时间戳格式化
    private getFomateDate(time) {
        if (typeof (time) === 'undefined') {
            return '';
        }
        let oDate = new Date(time),
            oYear = oDate.getFullYear(),
            oMonth = oDate.getMonth() + 1,
            oDay = oDate.getDate(),
            oHour = oDate.getHours(),
            oMin = oDate.getMinutes(),
            oSen = oDate.getSeconds(),
            oTime = oYear + '-' + this.getzf(oMonth) + '-' + this.getzf(oDay) + ' ' + this.getzf(oHour) + ':' + this.getzf(oMin) + ':' + this.getzf(oSen);// 最后拼接时间

        return oTime;
    };

    // 补0操作,当时间数据小于10的时候，给该数据前面加一个0
    private getzf(num) {
        if (parseInt(num) < 10) {
            num = '0' + num;
        }
        return num;
    }
}

