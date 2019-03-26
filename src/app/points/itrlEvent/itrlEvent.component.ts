import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {SERVER_API_URL} from '../../app.constants';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DataTableDirective} from 'angular-datatables';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {HttpClient} from '@angular/common/http';
import {DataTablesResponse} from '../../shared/data-tables-response';
import {ItrlEventService} from './itrlEvent.service';
import {EventChangeRelaDto, ItrlEventDto} from './itrlEvent-dto';


declare var $: any;
declare var jQuery: any;
declare var swal: any;

@Component({
    selector: 'app-itrlEvent',
    templateUrl: './itrlEvent.component.html',
    styleUrls: ['./itrlEvent.component.css']
})
export class ItrlEventComponent implements OnInit {
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    @ViewChild('content') content: TemplateRef<any>;
    @ViewChild('joinChange') joinChange: TemplateRef<any>;
    dtOptions: DataTables.Settings = {};
    saveForm: FormGroup;
    searchForm: FormGroup;
    mr: NgbModalRef;

    eventId: string = '';
    itrlEventDto: ItrlEventDto;
    eventChangeRelaDto:EventChangeRelaDto;
    eventChange:any;

    eventChangeDto: any = [{'changeNo': '', 'eventService': ''}];

    constructor(private fb: FormBuilder,
                private modalService: NgbModal,
                private http: HttpClient,
                private itrlEventService: ItrlEventService,) {
        this.searchForm = this.fb.group({
            eventName: '',
            eventStatus:''
        })
    }

    ngOnInit() {

        this.getAllItrlChanges();
        // 表单验证
        this.saveForm = this.fb.group({
            id: [],
            eventName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(36)]],
            eventCode: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(36)]],
            eventRemark: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(36)]],
            eventStatus: ['', [Validators.required]]

        });


        this.dateRangePicker();
        const that = this;
        this.dtOptions = {
            searching: false,
            serverSide: true,
            processing: true,
            ordering: false,
            autoWidth:true,
            scrollX: true,
            ajax: (dataTablesParameters: any, callback) => {
                that.http.post<DataTablesResponse>(
                    SERVER_API_URL + 'integralapp/api/itrlEventsPages' + '?draw=' + dataTablesParameters.draw + '&start=' + dataTablesParameters.start + '&length=' + dataTablesParameters.length,
                    this.searchForm.value,{}
                ).subscribe(resp => {
                    callback({
                        recordsTotal: resp.recordsTotal,
                        recordsFiltered: resp.recordsFiltered,
                        data: resp.data
                    });
                });
            },
            columns: [{
                title: '事件名称',
                data: 'eventName'
            }, {
                title: '事件编码',
                data: 'eventCode'
            }, {
                title: '事件说明',
                data: 'eventRemark'
            }, {
                title: '规则编号',
                data: 'eventChangeRelas',
                render: function (data, type, row) {
                    if ('' == data) {
                        return '';
                    }
                    var b = '';
                    for (var a in data) {
                        b += data[a].changeNo + "    "
                    }
                    return b;
                }
            }, {
                title: '事件服务',
                data: 'eventChangeRelas',
                render: function (data, type, row) {
                    if ('' == data) {
                        return '';
                    }
                    var b = '';
                    for (var a in data) {
                        b += data[a].eventService + "    "
                    }
                    return b;
                }
            }, {
                title: '事件状态',
                data: 'eventStatus',
                render: function (data, type, row) {
                    if (data == 0) {
                        return '禁用';
                    } else{
                        return '启用';
                    }

                }
            },  {
                title: '创建时间',
                data: 'createDate',
                render: function (data, type, row) {
                    return that.getFomateDate(data);
                }
            }, {
                title: '创建人',
                data: 'createBy'
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



    /*-------------------------------获取积分变动规则-------------------------------------*/
    getAllItrlChanges() {
        this.itrlEventService.getAllItrlChanges().subscribe((response) => {
            this.eventChange=response.body;

        }, () => {
            this.errorSwal("获取积分变动规则失败");
        });
    }


    //获取绑定事件
    someClick(info: any) {
        this.eventId = info.id;
    }

    //清空id
    clearParam() {
        this.eventId = '';
    }

    /*-------------------------------查询-------------------------------------*/
    search() {
        this.clearParam();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.draw();
        });
    }
    /*-------------------------------新增-------------------------------------*/
    showAddModal() {
        this.saveForm.reset();
        this.eventChangeDto = [{'changeNo': '', 'eventService': ''}];
        this.mr = this.modalService.open(this.content);
    }


    /*-------------------------------保存-------------------------------------*/
    saveEvent() {
        this.itrlEventDto = this.saveForm.value;
        this.itrlEventDto.eventChangeRelas=new Array<EventChangeRelaDto>();
        this.eventChangeRelaDto = new EventChangeRelaDto();
        this.eventChangeRelaDto.eventCode=this.saveForm.value.id;
        for (var i in this.eventChangeDto) {
            if ('' != this.eventChangeDto[i].changeNo) {
                this.eventChangeRelaDto.changeNo = this.eventChangeDto[i].changeNo;
            } else {
                this.errorSwal('规则编号不能为空');
                break;
            }
            if ('' != this.eventChangeDto[i].eventService) {
                this.eventChangeRelaDto.eventService = this.eventChangeDto[i].eventService;
            } else {
                this.errorSwal('事件服务不能为空');
                break;
            }
            this.itrlEventDto.eventChangeRelas[0]= this.eventChangeRelaDto;
            if (this.saveForm.value.id == null){
                this.itrlEventService.create(this.itrlEventDto).subscribe((response) => this.onSaveSuccess(response), () => this.onSaveError());
            } else {
                this.itrlEventService.edit(this.itrlEventDto).subscribe((response) => this.onEditSuccess(response), () => this.onEditError());
            }
        }

    }


    /*-------------------------------编辑-------------------------------------*/
    getEventById(eventId) {
        if (eventId == "" || eventId == null) {
            this.errorSwal('请先选中一行');
        } else {
            this.itrlEventService.getEvent(eventId).subscribe((response) => this.onGetEventSuccess(response), () => this.onGetEventError());
        }
    }



    // 获取用户成功  渲染到编辑页面  打开编辑页面
    private onGetEventSuccess(result) {

        this.saveForm.setValue({
            'id': result.body.id,
            'eventName': result.body.eventName,
            'eventCode': result.body.eventCode,
            'eventRemark': result.body.eventRemark,
            'eventStatus': result.body.eventStatus,
        });

        this.eventChangeDto=[]
        if (null != result.body.eventChangeRelas) {
            for (var i in result.body.eventChangeRelas) {
                this.eventChangeDto.push({
                    'changeNo': result.body.eventChangeRelas[i].changeNo,
                    'eventService': result.body.eventChangeRelas[i].eventService
                });

            }
        }


        this.mr = this.modalService.open(this.content);
    }


    private onGetEventError() {
        this.errorSwal('获取失败');
    }



    private onSaveSuccess(result) {
        //关闭modal
        this.mr.dismiss('cancel');
        this.clearParam();
        this.successSwal('保存成功');
        //保存成功，刷新表单
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
    }

    private onSaveError() {
        this.errorSwal('保存失败');
    }


    private onEditSuccess(result) {
        //关闭modal
        this.mr.dismiss('cancel');
        this.successSwal('更新成功');
        this.clearParam();
        //保存成功，刷新表单
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
    }

    private onEditError() {
        this.clearParam();
        this.errorSwal('更新失败');
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
