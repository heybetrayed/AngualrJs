import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {SERVER_API_URL} from '../../app.constants';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import {DataTableDirective} from 'angular-datatables';
import {HttpClient} from '@angular/common/http';
import {DataTablesResponse} from '../../shared/data-tables-response';
import {DatamanagerService} from './datamanager.service';
import {DditDto} from './ddit-dto';
import {ActivatedRoute, Router} from '@angular/router'
import {Page} from '../itrlMem/page-dto';

declare let $: any;
declare let swal: any;

@Component({
    selector: 'app-datamanage',
    templateUrl: './datamanage.component.html',
    styleUrls: ['./datamanage.component.css']
})
export class DatamanageComponent implements OnInit {

    flag: boolean;
    data: any;
    dditId: string = '';
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    @ViewChild('content') content: TemplateRef<any>;
    dtOptions: any = {};
    saveForm: FormGroup;
    searchForm: FormGroup;
    mr: NgbModalRef;
    dditDto: DditDto;
    //  标题名称
    titleName: string = '';
    //  分页
    pages: any;

    constructor(private fb: FormBuilder,
                private modalService: NgbModal,
                private http: HttpClient,
                private datamanagerService: DatamanagerService,
                private router: Router, // 路由
                private routeInfo: ActivatedRoute
    ) {
        this.routeInfo.queryParams.subscribe(queryParams => {
            this.pages = new Page();
            this.pages.resultStart = queryParams['start'];
            this.pages.resultLength = queryParams['length'];
        });
        this.searchForm = this.fb.group({
            dditCode: '',
            dditName: '',
            startEndTime: '',
            createBy: '',
            dditStatus: ''
        })
    }

    ngOnInit() {

        //  保存表单验证
        this.saveForm = this.fb.group({
            id: [],
            dditCode: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(15)]],
            dditName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(15)]],
            dditStatus: ['', [Validators.required]]
        });

        const that = this;

        this.dateRangePicker();

        this.dtOptions = {
            searching: false,
            serverSide: true,
            processing: true,
            ordering: false,
            autoWidth: true,
            scrollX: true,
            displayStart: null == this.pages.resultStart ? 0 : parseInt(this.pages.resultStart, 10), //  初始化开始分页起始点
            pageLength: null == this.pages.resultLength ? 10 : parseInt(this.pages.resultLength, 10), //  初始化每页行数
            ajax: (dataTablesParameters: any, callback) => {
                if (null != that.pages) {
                    if (null != that.pages.resultStart && null != that.pages.resultLength) {
                        that.pages.resultStart = null;
                        that.pages.resultLength = null;
                    }
                }
                that.http.post<DataTablesResponse>(
                    SERVER_API_URL + 'integralapp/api/dditsPages' + '?draw=' +
                    dataTablesParameters.draw + '&start=' + dataTablesParameters.start + '&length=' + dataTablesParameters.length,
                    this.searchForm.value, {}
                ).subscribe(resp => {
                    if (null == that.pages)
                        that.pages = new Page();
                    that.pages.start = dataTablesParameters.start;
                    that.pages.length = dataTablesParameters.length;
                    callback({
                        recordsTotal: resp.recordsTotal,
                        recordsFiltered: resp.recordsFiltered,
                        data: resp.data
                    });
                });
            },
            columns: [{
                title: '序号',
                data: 'index',
                render: function (data, type, row, meta) {
                    return meta.row + 1 + meta.settings._iDisplayStart;
                }
            }, {
                title: '数据字典表ID',
                data: 'id'
            }, {
                title: '字段编号',
                data: 'dditCode'
            }, {
                title: '字段名称',
                data: 'dditName'
            }, {
                title: '创建时间',
                data: 'createDate',
                render: function (data, type, row) {
                    return that.getFomateDate(data);
                },
            }, {
                title: '创建人',
                data: 'createBy'
            }, {
                title: '修改时间',
                data: 'updateDate',
                render: function (data, type, row) {
                    return that.getFomateDate(data);
                },
            }, {
                title: '修改人',
                data: 'updateBy'
            }, {
                title: '状态',
                data: 'dditStatus',
                render: function (data, type, row) {
                    if (data == 0) {
                        return '禁用';
                    } else {
                        return '启用';
                    }
                },
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
                'info': '第 _START_ 条 到第 _END_ 条/共有 _TOTAL_ 条',
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

    // 获取绑定事件
    someClick(info: any) {
        this.dditId = info.id;
    }

    // 查询
    search() {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
    }


    // 弹出新增窗口 ture 清空值  false 不清空
    showAddModal(result) {
        this.titleName = '编辑';
        if (result) {
            this.titleName = '新增';
            //  清空
            this.saveForm.reset();
            //  this.saveForm.setValue({
            //      'id': '',
            //      'dditCode': '',
            //      'dditName': '',
            //      'dditStatus': ''
            //  });
        }
        this.mr = this.modalService.open(this.content);
    }

    // 保存
    saveDdit() {
        this.dditDto = this.saveForm.value;
        if ('' === this.saveForm.value.id) {
            this.dditDto.id = null;
        }
        // edit
        this.datamanagerService.edit(this.dditDto).subscribe((response) => this.onEditSuccess(response), () => this.onUpdateError());
    }

    // 获取
    getDdit(id) {
        if (id !== '') {
            this.flag = false;
            this.datamanagerService.get(id).subscribe((response) => this.onGetDditSuccess(response), () => this.onGetError());
        } else {
            this.errorSwal('请先选中一行');
        }
    }

    //  删除
    deleteDdit(id) {
        const that = this;
        if (id !== '') {
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
                function (isConfirm) {
                    if (isConfirm) {
                        if (id !== '') {
                            that.datamanagerService.get(id).subscribe((response) => that.deleteDditSuccess(response),
                                () => that.onGetError());
                        }
                    }
                });
        } else {
            this.errorSwal('请先选中一行');
        }
    }

    // 编辑返回成功
    private onEditSuccess(result) {
        if (null != result.body.id) {

            // 关闭modal
            this.mr.dismiss('cancel');
            // 对象赋值为空
            this.dditDto = null;
            // 清空id
            this.clearParam();
            this.successSwal('成功');
            // 刷新表格
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                dtInstance.ajax.reload();
            });
        }
    }

    // 保存返回成功
    private onDeleteSuccess(result, boolean) {
        if (boolean) {
            // 关闭modal
            this.mr.dismiss('cancel');
        }
        // 对象赋值为空
        this.dditDto = null;
        // 清空id
        this.clearParam();
        this.successSwal('删除成功');
        // 刷新表格
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
    }

    // 清空id
    clearParam() {
        this.dditId = '';
    }

    // get 获取成功
    private onGetDditSuccess(result) {
        this.saveForm.setValue({
            'id': result.body.id,
            'dditCode': result.body.dditCode,
            'dditName': result.body.dditName,
            'dditStatus': result.body.dditStatus
        });
        // 弹出窗口
        this.showAddModal(false);
    }

    // get 返回成功
    private deleteDditSuccess(result) {
        this.dditDto = result.body;
        this.dditDto.dditStatus = '0';
        // edit
        this.datamanagerService.edit(this.dditDto).subscribe((response) => this.onDeleteSuccess(response, false),
            () => this.onUpdateError());
    }

    // 获取失败
    private onGetError() {
        this.errorSwal('获取失败');
    }

    // 保存失败
    private onSaveError() {
        this.errorSwal('保存失败');
    }

    // 修改失败
    private onUpdateError() {
        this.errorSwal('失败');
    }

    // 删除失败
    private onDeleteError() {
        this.errorSwal('删除失败');
    }

    dateRangePicker() {
        const that = this;
        const picker: any = $('#startEndTime');
        const dataRageOption: Object = {
            'timePicker': false,
            'timePicker24Hour': false,
            'autoUpdateInput': false,
            'drops': 'down',
            'opens': 'left',
            'ranges': {
                '清空': ['', ''],
                '今日': [moment().startOf('day'), moment().subtract('days', -1).endOf('day')],
                '昨日': [moment().subtract('days', 1).startOf('day'), moment().startOf('day')],
                '最近7日': [moment().subtract('days', 5), moment().subtract('days', -1).endOf('day')],
                '最近30日': [moment().subtract('days', 28), moment().subtract('days', -1).endOf('day')]
            },
            'locale': {
                'format': 'YYYY-MM-DD',
                'separator': ' / ',
                'applyLabel': '应用',
                'cancelLabel': '取消',
                'fromLabel': 'From',
                'resetLabel': '重置',
                'toLabel': 'To',
                'customRangeLabel': '自定义',
                'daysOfWeek': ['日', '一', '二', '三', '四', '五', '六'],
                'monthNames': ['一月', '二月', '三月', '四月', '五月', '六月', '7月', '八月', '九月', '十月', '十一月', '十二月'],
                'firstDay': 1
            }
        };
        picker.daterangepicker(dataRageOption, function (start, end, label) {
            // 日期是否为空
            if (this.startDate._isValid == false || this.endDate._isValid == false) {
                that.searchForm.patchValue({
                    startEndTime: ''
                });
                this.startDate = moment().subtract('days', 2).endOf('day');
                this.endDate = moment().startOf('day');
            } else {
                this.element.val(this.startDate.format(this.locale.format)
                    + this.locale.separator + this.endDate.format(this.locale.format));
                that.searchForm.patchValue({
                    startEndTime: this.element.val()
                });
            }

        });

    }

    queryDetail(id) {
        if (id !== '') {
            this.router.navigate(['/points/dataItemManage'],
                {queryParams: {'id': id, 'start': this.pages.start, 'length': this.pages.length}});
        } else {
            this.errorSwal('请先选中一行');
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


    checkCode() {
        this.dditDto = new DditDto();
        this.dditDto.id = this.saveForm.value.id;
        this.dditDto.dditCode = this.saveForm.value.dditCode;
        if (this.saveForm.value.dditCode.length > 0) {
            this.datamanagerService.checkDditCode(this.dditDto).subscribe((response) => this.flag = response.body,
                () => this.onSaveError());
        }
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
        if (typeof(time) === 'undefined') {
            return '';
        }
        const oDate = new Date(time),
            oYear = oDate.getFullYear(),
            oMonth = oDate.getMonth() + 1,
            oDay = oDate.getDate(),
            oHour = oDate.getHours(),
            oMin = oDate.getMinutes(),
            oSen = oDate.getSeconds(),
            oTime = oYear + '-' + this.getzf(oMonth) + '-' + this.getzf(oDay) + ' ' +
                this.getzf(oHour) + ':' + this.getzf(oMin) + ':' + this.getzf(oSen); // 最后拼接时间

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
