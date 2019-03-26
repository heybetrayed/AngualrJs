import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {SERVER_API_URL} from '../../app.constants';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import {DataTableDirective} from 'angular-datatables';
import {HttpClient} from '@angular/common/http';
import {DataTablesResponse} from '../../shared/data-tables-response';
import {ItrlRecordService} from './itrlRecord.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ItrlRecordDto} from './itrlRecord-dto';
import {Page} from '../itrlMem/page-dto';

declare var $: any;
declare var jQuery: any;
declare var swal: any;

@Component({
    selector: 'app-itrlRecord',
    templateUrl: './itrlRecord.component.html',
    styleUrls: ['./itrlRecord.component.css']
})
export class ItrlRecordComponent implements OnInit {

    flag = '';
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    @ViewChild('content') content: TemplateRef<any>;
    dtOptions: any = {};
    dtOptions_2: any = {};
    searchForm: FormGroup;
    mr: NgbModalRef;
    itrlMember: any = [{'memName': '', 'memNo': ''}];
    itrlMemID: string = '';
    itrlRecordDto: ItrlRecordDto;
    // 分页
    pages: any;

    constructor(private fb: FormBuilder,
                private modalService: NgbModal,
                private http: HttpClient,
                private itrlRecordService: ItrlRecordService,
                private routeInfo: ActivatedRoute,//获取传过的参数
                private router: Router //路由
    ) {


        this.routeInfo.queryParams.subscribe(queryParams => {
            this.itrlMemID = queryParams['id'];
            this.pages = new Page();
            this.pages.resultStart = queryParams['start'];
            this.pages.resultLength = queryParams['length'];
        });
        this.searchForm = this.fb.group({
            startEndTime: '',
            raiseStatus: '',
            itrlMemId: this.itrlMemID
        })
    }

    ngOnInit() {
        this.itrlRecordService.getItrlMember(this.itrlMemID).subscribe((response) => {
            this.itrlMember = response.body;
        });

        this.dateRangePicker();
        $(function () {
            $('.select2').select2();
            $('.select2-tags').select2({
                tags: true,
                tokenSeparators: [',', ' ']
            });
        });

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
                    SERVER_API_URL + 'integralapp/api/itrlRaisesPages' + '?draw=' + dataTablesParameters.draw + '&start=' + dataTablesParameters.start + '&length=' + dataTablesParameters.length,
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
                title: '序号',
                data: 'index',
                render: function (data, type, row, meta) {
                    return meta.row + 1 + meta.settings._iDisplayStart;
                }
            }, {
                title: '积分ID',
                data: 'id'
            }, {
                title: '分数',
                data: 'raiseScore'
            }, {
                title: '积分增减',
                data: 'itrlChange',
                render: function (data, type, row) {
                    return '增加';
                }
            }, {
                title: '创建时间',
                data: 'raiseGainDate',
                render: function (data, type, row) {
                    return that.getFomateDate(data);
                },
            }, {
                title: '积分类型',
                data: 'raiseItrlType',
                render: function (data, type, row) {
                    return data.typeName;
                }
            }, {
                title: '积分状态',
                data: 'raiseStatus',
                render: function (data, type, row) {
                    if (data == 1) {
                        return '待生效';
                    } else if (data == 2) {
                        return '生效中';
                    } else if (data == 3) {
                        return '已使用';
                    } else if (data == 4) {
                        return '已冻结';
                    } else {
                        return '已失效';
                    }
                },
            }, {
                title: '积分生效日',
                data: 'raiseValidDate',
                render: function (data, type, row) {
                    return that.getFomateDate(data);
                },
            }, {
                title: '积分有效期',
                data: 'raiseInvalidDate',
                render: function (data, type, row) {
                    return that.getFomateDate(data);
                },
            }, {
                title: '增加原因',
                data: 'raiseRemark'
            }, {
                title: '增加积分规则',
                data: 'raiseTranactionNum'
            }, {
                title: '积分来源',
                data: 'raiseIntegralSource'
            }, {
                title: '剩余积分',
                data: 'raiseSurplus'
            }, {
                title: '变动次数',
                data: 'integralReduces',
                render: function (data, type, row) {
                    if (null == data) {
                        return 0;
                    } else {
                        return data.length;
                    }
                }
            }],

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
            },

            rowCallback(row: Node, data: any[] | Object, index: number) {
                $('td', row).unbind('click');
                $('td', row).bind('click', function () {
                    that.someClick(data);
                    $('td', row).parent().siblings().removeAttr('style');
                    $('td', row).parent().css('background', '#868e96');
                });
                return row;
            },
        };

    }

    queryDetail() {
        this.router.navigate(['/points/itrlMem'], {queryParams: {'start': this.pages.resultStart, 'length': this.pages.resultLength}});
    }

    //获取绑定事件
    someClick(info: any) {
        this.flag = info.id;
    }

    //获取
    getDdit(itrlRaiseId: any) {
        if (itrlRaiseId != '') {
            this.onGetSuccess(itrlRaiseId);
        } else {
            this.onGetError();
        }
    }

    //获取成功
    private onGetSuccess(itrlRaiseId) {
        //弹出窗口
        this.showAddModal(itrlRaiseId);
    }

    //弹出窗口
    showAddModal(itrlRaiseId) {
        this.mr = this.modalService.open(this.content, {windowClass: 'modal-size-large'});
        const that = this;
        this.dtOptions_2 = {
            searching: false,
            serverSide: true,
            processing: true,
            ordering: false,
            autoWidth: true,
            scrollX: true,
            ajax: (dataTablesParameters: any, callback) => {
                that.http.post<DataTablesResponse>(
                    SERVER_API_URL + 'integralapp/api/itrlReducesPages' + '?draw=' + dataTablesParameters.draw + '&start=' + dataTablesParameters.start + '&length=' + dataTablesParameters.length,
                    {'itrlRaiseId': itrlRaiseId}, {}
                ).subscribe(resp => {
                    callback({
                        recordsTotal: resp.recordsTotal,
                        recordsFiltered: resp.recordsFiltered,
                        data: resp.data

                    });
                });
            },
            columns: [{
                title: '积分ID',
                data: 'id'
            }, {
                title: '增加积分ID',
                data: 'itrlRaiseId'
            }, {
                title: '减少积分规则',
                data: 'reduceTransactionNum'
            }, {
                title: '分数',
                data: 'reduceScore'
            }, {
                title: '积分增减',
                data: 'itrlChange',
                render: function () {
                    return '减少';
                }
            }, {
                title: '创建时间',
                data: 'reduceDate',
                render: function (data, type, row) {
                    return that.getFomateDate(data);
                },
            }, {
                title: '减少原因',
                data: 'reduceRemark'
            }, {
                title: '积分状态',
                data: 'raiseStatus',
                render: function () {
                    return '已使用';
                },
            }],

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


    //获取失败
    private onGetError() {
        this.errorSwal('请先选中一行');
    }

    //查询
    search() {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
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
            //日期是否为空
            if (this.startDate._isValid == false || this.endDate._isValid == false) {
                that.searchForm.patchValue({
                    startEndTime: ''
                });
                this.startDate = moment().subtract('days', 2).endOf('day');
                this.endDate = moment().startOf('day');
            } else {
                this.element.val(this.startDate.format(this.locale.format) + this.locale.separator + this.endDate.format(this.locale.format))
                that.searchForm.patchValue({
                    startEndTime: this.element.val()
                });
            }
        });

    }

    data: any;

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
