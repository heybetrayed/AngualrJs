import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {SERVER_API_URL} from '../../app.constants';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DataTableDirective} from 'angular-datatables';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {HttpClient} from '@angular/common/http';
import {DataTablesResponse} from '../../shared/data-tables-response';
import {ItrlAuditService} from './itrlAudit.service';
import * as moment from 'moment';
import {ItrlMemDTO, TransferDTO} from '../itrlAdjust/itrlAdjust-dto';
import {UserService} from '../../gateway/user/user.service';
import {UserDto} from '../../gateway/user/UserDto';

declare var $: any;
declare var jQuery: any;
declare var swal: any;

@Component({
    selector: 'app-itrlAudit',
    templateUrl: './itrlAudit.component.html',
    styleUrls: ['./itrlAudit.component.css']
})
export class ItrlAuditComponent implements OnInit {
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    @ViewChild('content') content: TemplateRef<any>;
    dtOptions: DataTables.Settings = {};
    saveForm: FormGroup;
    searchForm: FormGroup;
    mr: NgbModalRef;
    itrlAuditId: string = '';
    //查询对象
    ajaxSearchTransferDTO:any=new TransferDTO();
    //根据id查询对象
    getSearchTransferDTO:any=new TransferDTO();
    //客户对象
    itrlMem:any=new ItrlMemDTO();
    //用户信息
    user:any = new UserDto();
    //调整前后积分
    // transferItemDTO: any=new TransferItemDTO();
    // transferAfterDTOS: any = new Array<TransferItemDTO>();
    constructor(private fb: FormBuilder,
                private modalService: NgbModal,
                private http: HttpClient,
                private itrlAuditService: ItrlAuditService,
                private userService:UserService) {
        this.searchForm = this.fb.group({
            memNo: '',
            memName: '',
            approveStatus: '',
            approveName: '',
            startEndApplyTime: '',
            startEndApproveTime: ''
        })
    }

    ngOnInit() {
        //查询用户
        this.userService.getUserLogin().subscribe((response)=>{this.user=response.body});
        // 表单验证
        this.saveForm = this.fb.group({
            id: [],
            transferNo: ['', [Validators.required]],
            transferType: ['', [Validators.required]],
            applyTime: ['', [Validators.required]],
            oldItrlMemStatus: ['', [Validators.required]],
            newItrlMemStatus: ['', [Validators.required]],
            transferReason: ['', [Validators.required]],
            approveStatus: ['', [Validators.required]],
            approveExplain: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(88)]],
            approveName: ['', [Validators.required]],
            approveTime: ['', [Validators.required]]
        });

        this.dateRangePicker();
        const that = this;
        this.dtOptions = {
            searching: false,
            serverSide: true,
            processing: true,
            ordering: false,
            ajax: (dataTablesParameters: any, callback) => {
                this.ajaxSearchTransferDTO=new TransferDTO();
                this.ajaxSearchTransferDTO=this.searchForm.value;
                this.ajaxSearchTransferDTO.itrlMem=new ItrlMemDTO();
                this.ajaxSearchTransferDTO.itrlMem.memNo=this.searchForm.value.memNo;
                this.ajaxSearchTransferDTO.itrlMem.memName=this.searchForm.value.memName;
                that.http.post<DataTablesResponse>(
                    SERVER_API_URL + 'integralapp/api/transfersPages' + '?draw=' + dataTablesParameters.draw + '&start=' + dataTablesParameters.start + '&length=' + dataTablesParameters.length,
                    this.ajaxSearchTransferDTO, {}
                ).subscribe(resp => {
                    callback({
                        recordsTotal: resp.recordsTotal,
                        recordsFiltered: resp.recordsFiltered,
                        data: resp.data
                    });
                });
            },
            columns: [{
                title: '调整编号',
                data: 'transferNo'
            }, {
                title: '调整类型',
                data: 'transferType',
                render: function (data, type, row) {
                    var a='';
                    if(0==data){
                        a='综合调整';
                    }else if(1==data){
                        a='加分';
                    }else if(2==data){
                        a='减分';
                    }else if(3==data){
                        a='积分状态调整';
                    }else if(4==data){
                        a='账号状态调整';
                    }
                    return a;
                }
            }, {
                title: '客户编号',
                data: 'itrlMem.memNo'
            }, {
                title: '客户姓名',
                data: 'itrlMem.memName'
            }, {
                title: '审核状态',
                data: 'approveStatus',
                render: function (data, type, row) {
                    var a='';
                    if (0==data){
                        a='待审核';
                    }else if(1==data){
                        a='审核通过';
                    }else if(2==data){
                        a='审核拒绝';
                    }else if(3==data){
                        a='失效';
                    }
                    return a;
                }
            }, {
                title: '申请人',
                data: 'applicatName'
            }, {
                title: '申请时间',
                data: 'applyTime',
                render: function (data, type, row) {
                    return that.getFomateDate(data);
                }
            }, {
                title: '审核人',
                data: 'approveName'
            }, {
                title: '审核时间',
                data: 'approveTime',
                render: function (data, type, row) {
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

    // 查询
    search() {
        //清空id
        this.clearId();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.draw();
        });
    }

    dateRangePicker() {
        const that = this;
        const picker: any = $('#startEndApplyTime');
        const picker2: any = $('#startEndApproveTime');
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
                    startEndApplyTime: ''
                });
                this.startDate = moment().startOf('day');
                this.endDate = moment().subtract('days', -1).endOf('day');
            } else {
                this.element.val(this.startDate.format(this.locale.format) + this.locale.separator + this.endDate.format(this.locale.format));
                that.searchForm.patchValue({
                    startEndApplyTime: this.element.val()
                });
            }

        });
        picker2.daterangepicker(dataRageOption, function (start, end, label) {
            //日期是否为空
            if (this.startDate._isValid == false || this.endDate._isValid == false) {
                that.searchForm.patchValue({
                    startEndApproveTime: ''
                });
                this.startDate = moment().subtract('days', 2).endOf('day');
                this.endDate = moment().startOf('day');
            } else {
                this.element.val(this.startDate.format(this.locale.format) + this.locale.separator + this.endDate.format(this.locale.format));
                that.searchForm.patchValue({
                    startEndApproveTime: this.element.val()
                });
            }

        });
    }

    // 弹出新增窗口
    showAddModal(boolean) {
        this.mr = this.modalService.open(this.content, {windowClass: 'modal-size-large'});
    }

    // 获取绑定事件
    someClick(info: any) {
        this.itrlAuditId = info.id;
    }

    // 清空id
    clearId() {
        this.itrlAuditId = '';
    }

    // 保存
    saveDdit() {
        this.getSearchTransferDTO.approveStatus=this.saveForm.value.approveStatus;
        this.getSearchTransferDTO.approveExplain=this.saveForm.value.approveExplain;
        this.getSearchTransferDTO.approveId=this.user.id;
        this.getSearchTransferDTO.approveName=this.user.login;
        var approveTime=this.saveForm.value.approveTime;
        // var time=new Date(Date.parse(approveTime));
        this.getSearchTransferDTO.approveTime=new Date(Date.parse(approveTime));
        this.itrlAuditService.edit(this.getSearchTransferDTO).subscribe((response) => this.onEditSuccess(response), () => this.onUpdateError());
    }


    // data: any;

    //导出excel
    // downloadExcel() {
    //     this.itrlLimit = this.searchForm.value;
    //     const that = this;
    //     this.itrlLimitService.downloadExcel(this.itrlLimit).subscribe((response) => {
    //             this.data = response.blob();
    //             $(function () {
    //                 var blob = new Blob([that.data], {type: 'application/vnd.ms-excel'});
    //                 var objectUrl = URL.createObjectURL(blob);
    //                 var a = document.createElement('a');
    //                 a.href = objectUrl;
    //                 a.download = '限制规则信息';
    //                 a.target = '_blank';
    //                 a.click();
    //                 that.successSwal('导出excel成功');
    //             })
    //         }, (error) => {
    //             this.errorSwal('导出excel错误!请联系管理员');
    //         }
    //     );
    // }

    // 获取
    getDdit(id) {
        if (id != '') {
            this.itrlAuditService.get(id).subscribe((response) => this.onGetLevSuccess(response), () => this.onGetError());
        } else {
            this.errorSwal('请先选中一行');
        }
    }

    // get 获取成功
    private onGetLevSuccess(result) {
        this.getSearchTransferDTO=result.body;
        if(null!=this.getSearchTransferDTO){
            if(0!=this.getSearchTransferDTO.approveStatus){
                this.errorSwal('只有状态为待审核才能审批');
            }else{
                this.saveForm.setValue({
                    'id': this.getSearchTransferDTO.id,
                    'transferNo': this.getSearchTransferDTO.transferNo,
                    'transferType': this.getSearchTransferDTO.transferType,
                    'applyTime': this.getFomateDate(this.getSearchTransferDTO.applyTime),
                    'oldItrlMemStatus': this.getSearchTransferDTO.oldItrlMemStatus,
                    'newItrlMemStatus': this.getSearchTransferDTO.newItrlMemStatus,
                    'transferReason': this.getSearchTransferDTO.transferReason,
                    'approveStatus': this.getSearchTransferDTO.approveStatus,
                    'approveExplain': this.getSearchTransferDTO.approveExplain,
                    'approveName': this.user.login,
                    'approveTime': this.getFomateDate(new Date())
                });
                // 弹出窗口
                this.showAddModal(false);
            }
        }
    }

    // 保存返回成功
    private onEditSuccess(result) {
        // 关闭modal
        this.mr.dismiss('cancel');
        // 对象赋值为空
        this.getSearchTransferDTO = null;
        //清空id
        this.clearId();
        //弹出框
        this.successSwal('成功');
        //刷新表格
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
    }


    //将时间戳格式化
    private getFomateDate(time) {
        if(null==time){
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
