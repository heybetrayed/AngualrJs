import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {SERVER_API_URL} from '../../app.constants';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import {DataTableDirective} from 'angular-datatables';
import {HttpClient} from '@angular/common/http';
import {DataTablesResponse} from '../../shared/data-tables-response';
import {DataItemManagerService} from '../dataItemManage/dataItemManager.service';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {DditItemDto} from './dditItem-dto';
import {ActivatedRoute, Router} from '@angular/router';
import {DatamanagerService} from '../datamanage/datamanager.service';
import {Page} from '../itrlMem/page-dto';

declare var $: any;
declare var jQuery: any;
declare var swal: any;

@Component({
    selector: 'app-data-item-manage',
    templateUrl: './dataItemManage.component.html',
    styleUrls: ['./dataItemManage.component.css']
})
export class DataItemManageComponent implements OnInit {

    dditItemId: string = '';
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    @ViewChild('content') content: TemplateRef<any>;
    dtOptions: any = {};
    saveForm: FormGroup;
    searchForm: FormGroup;
    mr: NgbModalRef;
    dditItemDto: DditItemDto;
    ddit: any = [{'dditName': '', 'dditCode': ''}];
    dditID: string = '';
    // 标题名称
    titleName: string = '';
    //分页
    pages: any;

    constructor(private fb: FormBuilder,
                private modalService: NgbModal,
                private http: HttpClient,
                private dataItemManagerService: DataItemManagerService,
                private routeInfo: ActivatedRoute,//获取传过的参数
                private dataMangerService: DatamanagerService,
                private router: Router //路由
    ) {
        this.routeInfo.queryParams.subscribe(queryParams => {
            this.dditID = queryParams['id'];
            this.pages = new Page();
            this.pages.resultStart = queryParams['start'];
            this.pages.resultLength = queryParams['length'];
        });
        this.searchForm = this.fb.group({
            dditItemCode: '',
            dditItemName: '',
            startEndTime: '',
            createBy: '',
            itemStatus: '',
            dditId: this.dditID
        })
    }

    ngOnInit() {

        this.dataMangerService.get(this.dditID).subscribe((response) => {
            this.ddit = response.body;
        });
        //保存表单验证
        this.saveForm = this.fb.group({
            id: [],
            dditItemCode: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(15)]],
            dditItemName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(15)]],
            itemStatus: ['', [Validators.required]]
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
                    SERVER_API_URL + 'integralapp/api/dditItemsPages' + '?draw=' + dataTablesParameters.draw + '&start=' + dataTablesParameters.start + '&length=' + dataTablesParameters.length,
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
                title: '数据字典子表ID',
                data: 'id'
            }, {
                title: '数据字典ID',
                data: 'dditId'
            }, {
                title: '字段编号',
                data: 'dditItemCode'
            }, {
                title: '字段名称',
                data: 'dditItemName'
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
                title: '状态',
                data: 'itemStatus',
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

    queryDetail() {
        this.router.navigate(['/points/datamanage'], {queryParams: {'start': this.pages.resultStart, 'length': this.pages.resultLength}});
    }

    //获取绑定事件
    someClick(info: any) {
        this.dditItemId = info.id;
    }

    //查询
    search() {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
    }


    //弹出新增窗口 ture 清空值  false 不清空
    showAddModal(result) {
        this.titleName = '修改';
        if (result) {
            this.titleName = '新增';
            // 清空
            this.saveForm.reset();
            // this.saveForm.setValue({
            //     'id': '',
            //     'dditItemCode': '',
            //     'dditItemName': '',
            //     'itemStatus': ''
            // });
        }
        this.mr = this.modalService.open(this.content);
    }

    //保存
    saveDdit() {
        this.dditItemDto = this.saveForm.value;
        this.dditItemDto.dditId = this.dditID;

        if ('' == this.saveForm.value.id) {
            this.dditItemDto.id = null;
        }
        //edit
        this.dataItemManagerService.edit(this.dditItemDto).subscribe((response) => this.onEditSuccess(response.body), () => this.onUpdateError());
    }

    //编辑返回成功
    private onEditSuccess(result) {
        if (null != result.json.id) {
            //关闭modal
            this.mr.dismiss('cancel');
            //对象赋值为空
            this.dditItemDto = null;
            //清空id
            this.clearParam();
            this.successSwal('成功');
            //刷新表格
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                dtInstance.ajax.reload();
            });
        }
    }

    //清空id
    clearParam() {
        this.dditItemId = '';
    }

    //获取
    getDditItem(id) {
        if (id != null && id != '') {
            this.flag = false;
            this.dataItemManagerService.get(id).subscribe((response) => this.getDditItemSuccess(response.body), () => this.onGetError());
        } else {
            this.errorSwal('请先选中一行');
        }
    }

    //get 获取成功
    private getDditItemSuccess(result) {
        this.saveForm.setValue({
            'id': result.id,
            'dditItemName': result.dditItemName,
            'dditItemCode': result.dditItemCode,
            'itemStatus': result.itemStatus
        });
        this.dditID = result.dditId;
        //弹出窗口
        this.showAddModal(false);
    }

    //删除
    deleteDditItem(id) {
        const that = this;
        if (id != '') {
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
                        if (id != '') {
                            that.dataItemManagerService.get(id).subscribe((response) => that.deleteDditItemSuccess(response.body), () => that.onGetError());
                        }
                    }
                });
        } else {
            this.errorSwal('请先选中一行');
        }
    }

    // 返回成功
    private deleteDditItemSuccess(result) {
        this.dditItemDto = result.json;
        this.dditItemDto.itemStatus = '0';
        //edit
        this.dataItemManagerService.edit(this.dditItemDto).subscribe((response) => this.onDeleteSuccess(response.body, false), () => this.onUpdateError());
    }

    //保存返回成功
    private onDeleteSuccess(result, boolean) {
        if (boolean) {
            //关闭modal
            this.mr.dismiss('cancel');
        }
        //对象赋值为空
        this.dditItemDto = null;
        //清空id
        this.clearParam();
        this.successSwal('删除成功');
        //刷新表格
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
    }


    //获取失败
    private onGetError() {
        this.errorSwal('获取失败');
    }

    //保存失败
    private onSaveError() {
        this.errorSwal('保存失败');
    }

    //修改失败
    private onUpdateError() {
        this.errorSwal('失败');
    }

    //删除失败
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

    flag: boolean;

    checkCode() {
        this.dditItemDto = new DditItemDto();
        this.dditItemDto.dditId = this.saveForm.value.id;
        this.dditItemDto.dditItemCode = this.saveForm.value.dditItemCode;
        if (this.saveForm.value.dditItemCode.length > 0) {
            this.dataItemManagerService.checkDditItemCode(this.dditItemDto).subscribe((response) => {
                if(null == response.body){
                    this.flag = false;
                }else{
                    this.flag = true;
                }
            }, () => this.onSaveError());
        }
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

