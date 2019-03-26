import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {SERVER_API_URL} from '../../app.constants';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DataTableDirective} from 'angular-datatables';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {HttpClient} from '@angular/common/http';
import {DataTablesResponse} from '../../shared/data-tables-response';
import {ItrlTypeService} from './itrlType.service';
import {ItrlTypeDTO} from './itrlType-dto';

declare var $: any;
declare var jQuery: any;
declare var swal: any;

@Component({
    selector: 'app-itrlType',
    templateUrl: './itrlType.component.html',
    styleUrls: ['./itrlType.component.css']
})
export class ItrlTypeComponent implements OnInit {
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    @ViewChild('content') content: TemplateRef<any>;
    dtOptions: DataTables.Settings = {};
    saveForm: FormGroup;
    searchForm: FormGroup;
    mr: NgbModalRef;
    itrlTypeDTO: any = new ItrlTypeDTO();
    // 标题名称
    titleName: string = '';
    //id
    itrlTypeId: string = '';


    constructor(private fb: FormBuilder,
                private modalService: NgbModal,
                private http: HttpClient,
                private itrlTypeService: ItrlTypeService) {
        this.searchForm = this.fb.group({
            typeName: '',
            typeStatus: '',
            financialSign: ''
        })
    }

    ngOnInit() {
        // 表单验证
        this.saveForm = this.fb.group({
            id: [],
            typeName: ['', [Validators.required]],
            financialSign: ['', [Validators.required]],
            typeStatus: ['', [Validators.required]]
        });

        this.dateRangePicker();
        const that = this;
        this.dtOptions = {
            searching: false,
            serverSide: true,
            processing: true,
            ordering: false,
            autoWidth: true,
            scrollX: true,
            ajax: (dataTablesParameters: any, callback) => {
                that.http.post<DataTablesResponse>(
                    SERVER_API_URL + 'integralapp/api/itrlTyPages' + '?draw=' + dataTablesParameters.draw + '&start=' + dataTablesParameters.start + '&length=' + dataTablesParameters.length,
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
                title: '积分类型id',
                data: 'id'
            }, {
                title: '积分类型名称',
                data: 'typeName'
            }, {
                title: '积分类型开关',
                data: 'typeSwitch',
                render: function (data, type, row) {
                    if (data == 0) {
                        return '开';
                    } else
                        return '关';
                }
            }, {
                title: '创建时间',
                data: 'createDate',
                render: function (data, type, row) {
                    return that.getFomateDate(data);
                }
            }, {
                title: '创建人',
                data: 'createBy'
            }, {
                title: '修改时间',
                data: 'updateDate',
                render: function (data, type, row) {
                    return that.getFomateDate(data);
                }
            }, {
                title: '修改人',
                data: 'updateBy'
            }, {
                title: '积分类型状态',
                data: 'typeStatus',
                render: function (data, type, row) {
                    if (data == 0) {
                        return '禁用';
                    } else
                        return '启用';
                }
            }, {
                title: '财务记账',
                data: 'financialSign',
                render: function (data, type, row) {
                    if (data == 0) {
                        return '不记账';
                    } else
                        return '记账';
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

    // 查询
    search() {
        //清空id
        this.clearParam();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.draw();
        });
    }

    dateRangePicker() {
        let picker: any = $('#raiseGainDate');
        let dataRageOption: Object = {
            'timePicker': false,
            'timePicker24Hour': false,
            'drops': 'down',
            'opens': 'left',
            'ranges': {},
            'locale': {
                'format': 'YYYY-MM-DD',
                'separator': ' / ',
                'applyLabel': '确定',
                'cancelLabel': '取消',
                'fromLabel': 'From',
                'toLabel': 'To',
                'customRangeLabel': '自定义',
                'daysOfWeek': ['日', '一', '二', '三', '四', '五', '六'],
                'monthNames': ['一月', '二月', '三月', '四月', '五月', '六月', '7月', '八月', '九月', '十月', '十一月', '十二月'],
                'firstDay': 1
            },
        };
        picker.daterangepicker(dataRageOption, function (start, end, label) {
            console.info(`start:${start.format('YYYY-MM-DD')}, end:${end}, label:${label}`);
        });
    }

    // 弹出新增窗口
    showAddModal(boolean) {
        if (boolean) {
            // 标题名称
            this.titleName = '新增';
            // 清空
            this.saveForm.reset();
        }
        this.mr = this.modalService.open(this.content);
    }

    // 获取绑定事件
    someClick(info: any) {
        this.itrlTypeId = info.id;
    }

    // 清空id
    clearParam() {
        this.itrlTypeId = '';
    }

    // 保存
    saveDdit() {
        this.itrlTypeDTO = this.saveForm.value;
        //默认值
        if (null == this.itrlTypeDTO.id) {
            //0禁用 1启用
            this.itrlTypeDTO.typeStatus = 1;
            this.itrlTypeDTO.typeSwitch = 0;
        }
        this.itrlTypeService.edit(this.itrlTypeDTO).subscribe((response) => this.onEditSuccess(response.body), () => this.onUpdateError())
    }

    // 获取
    getDdit(id) {
        if (id != '') {
            this.itrlTypeService.get(id).subscribe((response) => this.onGetLevSuccess(response.body), () => this.onGetError());
        } else {
            this.errorSwal('请先选中一行');
        }
    }

    // get 获取成功
    private onGetLevSuccess(result) {
        // 赋值
        this.saveForm.setValue({
            'id': result.id,
            'typeName': result.typeName,
            'financialSign': result.financialSign,
            'typeStatus': result.typeStatus
        });
        // 标题名称
        this.titleName = '编辑';
        // 弹出窗口
        this.showAddModal(false);
    }

    // 返回成功
    private onEditSuccess(result) {
        // 关闭modal
        this.mr.dismiss('cancel');
        // 对象赋值为空
        this.itrlTypeDTO = null;
        //清空id
        this.clearParam();
        //弹出框
        this.successSwal('成功');
        //刷新表格
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
    }

    //get 获取失败
    private onGetError() {
        this.errorSwal('获取失败');
    }

    //修改失败
    private onUpdateError() {
        //关闭modal
        this.mr.dismiss('cancel');
        this.errorSwal('失败');
    }

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
