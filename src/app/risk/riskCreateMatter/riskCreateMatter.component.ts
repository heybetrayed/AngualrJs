import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import {DataTableDirective} from 'angular-datatables';
import {HttpClient} from '@angular/common/http';
import {jqxTreeComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxtree';

declare var $: any;
declare var jQuery: any;
declare var swal: any;

@Component({
    selector: 'app-riskCreateMatter',
    templateUrl: './riskCreateMatter.component.html',
    styleUrls: ['./riskCreateMatter.component.css']
})
export class RiskCreateMatterComponent implements OnInit {

    dditItemId: string = '';
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    @ViewChild('content') content: TemplateRef<any>;
    @ViewChild('myTree') myTree: jqxTreeComponent;
    dtOptions: any = {};
    saveForm: FormGroup;
    mr: NgbModalRef;
    reportID: string = '';
    // 标题名称
    titleName: string = '';
    //显示填写页面
    showAdd: boolean = false;
    //分页
    pages: any;

    columns: any = [{
        'title': '项目',
        'data': 'name01'
    }, {
        'title': '本季度',
        'data': 'name02'
    }, {
        'title': '上季度',
        'data': 'name03'
    }, {
        'title': '同比增减',
        'data': 'name04'
    }, {
        'title': '同比增减幅度',
        'data': 'name05'
    }];

    jsonData: any = [
        {
            'id': '2',
            'parentid': '1',
            'text': '宏观经济形势',
            'value': ''
        }, {
            'id': '3',
            'parentid': '1',
            'text': '行业环境分析',
            'value': ''
        }, {
            'id': '4',
            'parentid': '1',
            'text': '监管动态',
            'value': ''
        }, {
            'id': '1',
            'parentid': '-1',
            'text': '全面风险管理外部环境分析'
        }, {
            'id': '6',
            'text': '总体风险状况',
            'parentid': '-1'
        }, {
            'id': '7',
            'parentid': '6',
            'text': '整体评价',
            'value': ''
        }, {
            'id': '8',
            'text': '主要管理指标情况',
            'parentid': '6',
            'value': ''
        }, {
            'id': '9',
            'text': '资本情况分析',
            'parentid': '6',
            'value': ''
        }, {
            'id': '10',
            'text': '风险偏好执行情况说明',
            'parentid': '6',
            'value': ''
        }, {
            'id': '11',
            'text': '风险限额执行情况说明',
            'parentid': '6',
            'value': ''
        }, {
            'id': '12',
            'text': '各项风险报告',
            'parentid': '-1'
        }, {
            'id': '13',
            'text': '信用风险',
            'parentid': '12'
        }, {
            'id': '15',
            'text': '信用风险状况',
            'parentid': '13',
            'value': ''
        }, {
            'id': '16',
            'text': '信用风险问题分析',
            'parentid': '13',
            'value': ''
        }, {
            'id': '17',
            'text': '信用风险管理建议',
            'parentid': '13',
            'value': ''
        }, {
            'id': '14',
            'text': '战略风险',
            'parentid': '12',
            'value': ''
        }];

    datas: any = [
        {
            'name01': '资产总额',
            'name02': '100',
            'name03': '90',
            'name04': '10%',
            'name05': '0',
        },
        {
            'name01': '负债总额',
            'name02': '200',
            'name03': '180',
            'name04': '10%',
            'name05': '0',
        },
        {
            'name01': '所有者权益',
            'name02': '1000',
            'name03': '900',
            'name04': '10%',
            'name05': '0',
        }
    ];

    constructor(private fb: FormBuilder,
                private modalService: NgbModal,
                private http: HttpClient,
    ) {
        this.saveForm = this.fb.group({
            reportId: ''
            // reportContent: ''
        })
    }

    // prepare the data
    source = {
        datatype: 'json',
        datafields: [
            {name: 'id'},
            {name: 'parentid'},
            {name: 'text'},
            {name: 'value'}
        ],
        id: 'id',
        localdata: this.jsonData
    };
    dataAdapter = new jqx.dataAdapter(this.source, {autoBind: true});
    records: any = this.dataAdapter.getRecordsHierarchy('id', 'parentid', 'items', [{name: 'text', map: 'label'}]);

    //点击触发事件
    ItemClick(event: any): void {
        //选中权限获取Id  根据Id查询对应权限 然后渲染页面
        let args = event.args;
        // let item =this.myTree.getItem(event.args.element);
        //选中的模块信息
        let selectedItem = this.myTree.getSelectedItem();
        //判断是否是有子集  有子集没value值
        if (null != selectedItem.value) {
            //选中的上级模块信息
            let parentItem = this.myTree.getItem(selectedItem.parentElement);
            console.log('点击了' + event.args.element.id);
            //显示内容
            this.showAdd = true;
            //标题赋值
            this.titleName = selectedItem.label;
            this.showDataTable();
            //加载文本编辑器
            $(function () {
                $('.summernote').summernote({
                    height: 350,
                    minHeight: 100,
                    maxHeight: 500,
                    focus: true
                });
                var code = $('.summernote').summernote('code');
                console.log('文本编辑器内容:' + code);
            });
        }
    }

    //拖拽触发事件
    dragStart(item): boolean {
        return false;
    }

    ngOnInit() {
        //保存表单验证
        this.saveForm = this.fb.group({
            reportId: []
            // reportContent: ['', [Validators.required]]
        });
    }

    //保存
    saveReport() {
        this.successSwal('保存成功');
    }

    //查询
    search() {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
    }

    //查看详情
    getRiskReport() {
        this.mr = this.modalService.open(this.content, {windowClass: 'modal-size-large'});
    }

    //显示表格
    showDataTable() {
        this.dateRangePicker();
        const that = this;
        this.dtOptions = {
            searching: false,
            serverSide: true,
            processing: true,
            ordering: false,
            autoWidth: true,
            scrollX: true,
            paginate: false,//禁止分页
            info: false,//禁止总条数 信息
            ajax: (dataTablesParameters: any, callback) => {
                // that.http.post<DataTablesResponse>(
                //     SERVER_API_URL + 'integralapp/api/dditItemsPages' + '?draw=' + dataTablesParameters.draw + '&start=' + dataTablesParameters.start + '&length=' + dataTablesParameters.length,
                //     this.searchForm.value, {}
                // ).subscribe(resp => {
                //     callback({
                //         recordsTotal: resp.recordsTotal,
                //         recordsFiltered: resp.recordsFiltered,
                //         data: resp.data
                //     });
                // });
                callback({
                    recordsTotal: 0,
                    recordsFiltered: 3,
                    data: that.datas
                });
            },
            columns: that.columns,
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
                'infoEmpty': '没有数据',
                'infoFiltered': '(过滤总件数 _MAX_ 条)'
            }
        };
    }

    //获取绑定事件
    someClick(info: any) {
        this.reportID = info.name01;
    }

    //弹出新增窗口 ture 清空值  false 不清空
    showAddModal(result) {
        // this.titleName = '修改';
        // if (result) {
        //     this.titleName = '新增';
        //     // 清空
        //     this.saveForm.reset();
        //     // this.saveForm.setValue({
        //     //     'id': '',
        //     //     'dditItemCode': '',
        //     //     'dditItemName': '',
        //     //     'itemStatus': ''
        //     // });
        // }
        this.mr = this.modalService.open(this.content);
    }

    //保存
    saveDdit() {
        // this.dditItemDto = this.saveForm.value;
        // this.dditItemDto.dditId = this.dditID;
        //
        // if ('' == this.saveForm.value.id) {
        //     this.dditItemDto.id = null;
        // }
        // //edit
        // this.dataItemManagerService.edit(this.dditItemDto).subscribe((response) => this.onEditSuccess(response), () => this.onUpdateError());
    }

    //编辑返回成功
    private onEditSuccess(result) {
        if (null != result.json.id) {
            //关闭modal
            this.mr.dismiss('cancel');
            //对象赋值为空
            // this.dditItemDto = null;
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
    getEdit(reportID) {
        if (reportID != null && reportID != '') {
            this.flag = false;
            // this.dataItemManagerService.get(id).subscribe((response) => this.getDditItemSuccess(response), () => this.onGetError());
        } else {
            this.errorSwal('请先选中一行');
        }
    }

    //get 获取成功
    private getDditItemSuccess(result) {
        this.saveForm.setValue({
            'id': result.json.id,
            'dditItemName': result.json.dditItemName,
            'dditItemCode': result.json.dditItemCode,
            'itemStatus': result.json.itemStatus
        });
        this.reportID = result.json.dditId;
        //弹出窗口
        this.showAddModal(false);
    }

    //删除
    deleteDditItem(id) {
        // const that = this;
        // if (id != '') {
        //     swal({
        //             title: '是否要删除?',
        //             type: 'warning',
        //             showCancelButton: true,
        //             confirmButtonClass: 'btn-danger',
        //             confirmButtonText: '确认',
        //             cancelButtonText: '取消',
        //             closeOnConfirm: false,
        //             closeOnCancel: true
        //         },
        //         function (isConfirm) {
        //             if (isConfirm) {
        //                 if (id != '') {
        //                     that.dataItemManagerService.get(id).subscribe((response) => that.deleteDditItemSuccess(response), () => that.onGetError());
        //                 }
        //             }
        //         });
        // } else {
        //     this.errorSwal('请先选中一行');
        // }
    }

    // 返回成功
    private deleteDditItemSuccess(result) {
        // this.dditItemDto = result.json;
        // this.dditItemDto.itemStatus = '0';
        // //edit
        // this.dataItemManagerService.edit(this.dditItemDto).subscribe((response) => this.onDeleteSuccess(response, false), () => this.onUpdateError());
    }

    //保存返回成功
    private onDeleteSuccess(result, boolean) {
        if (boolean) {
            //关闭modal
            this.mr.dismiss('cancel');
        }
        //对象赋值为空
        // this.dditItemDto = null;
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
            // if (this.startDate._isValid == false || this.endDate._isValid == false) {
            //     that.searchForm.patchValue({
            //         startEndTime: ''
            //     });
            //     this.startDate = moment().subtract('days', 2).endOf('day');
            //     this.endDate = moment().startOf('day');
            // } else {
            //     this.element.val(this.startDate.format(this.locale.format) + this.locale.separator + this.endDate.format(this.locale.format))
            //     that.searchForm.patchValue({
            //         startEndTime: this.element.val()
            //     });
            // }
        });


    }

    flag: boolean;

    checkCode() {
        // this.dditItemDto = new DditItemDto();
        // this.dditItemDto.dditId = this.saveForm.value.id;
        // this.dditItemDto.dditItemCode = this.saveForm.value.dditItemCode;
        // if (this.saveForm.value.dditItemCode.length > 0) {
        //     this.dataItemManagerService.checkDditItemCode(this.dditItemDto).subscribe((response) => this.flag = response.json, () => this.onSaveError());
        // }
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

