import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {SERVER_API_URL} from '../../app.constants';
import {DataTablesResponse} from '../../shared/data-tables-response';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {DataTableDirective} from 'angular-datatables';
import {ActivatedRoute, Router} from '@angular/router';
import {ItrlMemService} from './itrlMem.service';
import {ItrlMemDTO} from '../itrlAdjust/itrlAdjust-dto';
import {FileUploader} from 'ng2-file-upload';
import {createRequestOption} from '../../core/http/request-util';
import * as moment from 'moment';
import {Page} from './page-dto';

declare var $: any;
declare var jQuery: any;
declare var swal: any;

@Component({
    selector: 'app-itrlMem',
    templateUrl: './itrlMem.component.html',
    styleUrls: ['./itrlMem.component.css']
})
export class ItrlMemComponent implements OnInit {
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    @ViewChild('content') content: TemplateRef<any>;

    dtOptions: DataTables.Settings = {};
    saveForm: FormGroup;
    searchForm: FormGroup;
    //ID
    itrlMemId: string = '';
    itrlMemDto: ItrlMemDTO;
    mr: NgbModalRef;
    // 标记
    flag: boolean = false;
    header: any = createRequestOption();
    fileList: any = [];
    // 分页
    pages: any;

    public uploader: FileUploader = new FileUploader({
        url: SERVER_API_URL + 'integralapp/api/bathSaveMem',
        method: 'POST',
        itemAlias: 'file',
        headers: this.header,
        queueLimit: 1,
        removeAfterUpload: true
    });

    constructor(private fb: FormBuilder,
                private modalService: NgbModal,
                private http: HttpClient,
                private router: Router, //路由
                private itrlMemService: ItrlMemService,
                private routeInfo: ActivatedRoute//获取传过的参数
    ) {
        this.routeInfo.queryParams.subscribe(queryParams => {
            this.pages = new Page();
            this.pages.resultStart = queryParams['start'];
            this.pages.resultLength = queryParams['length'];
        });
        this.searchForm = this.fb.group({
            memName: '',
            memNo: '',
            memPhone: '',
            startEndTime: '',
        })
    }

    ngOnInit() {
        $(function () {
            $('#phone-mask-input').mask('00000000000');
        });
        //表单验证
        this.saveForm = this.fb.group({
            id: [],
            memNo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
            memName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
            memPhone: [],
            memAccountType: ['', [Validators.required, Validators.nullValidator]]
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
            displayStart: null == this.pages.resultStart ? 0 : parseInt(this.pages.resultStart),//初始化开始分页起始点
            pageLength: null == this.pages.resultLength ? 10 : parseInt(this.pages.resultLength),//初始化每页行数
            ajax: (dataTablesParameters: any, callback) => {
                if (null != that.pages) {
                    if (null != that.pages.resultStart && null != that.pages.resultLength) {
                        that.pages.resultStart = null;
                        that.pages.resultLength = null;
                    }
                }
                that.http.post<DataTablesResponse>(
                    SERVER_API_URL + 'integralapp/api/itrlMemsPages' + '?draw=' + dataTablesParameters.draw + '&start=' + dataTablesParameters.start + '&length=' + dataTablesParameters.length,
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
                title: '客户姓名',
                data: 'memName'
            }, {
                title: '客户编号',
                data: 'memNo'
            }, {
                title: '客户手机号',
                data: 'memPhone'
            }, {
                title: '消费分',
                data: 'memTypeRelas',
                render: function (data, type, row) {
                    if (null == data)
                        return 0;
                    var b = 0;
                    for (var a in data) {
                        if ('消费积分' == data[a].itrlType.typeName) {
                            b = data[a].currentScore;
                        }
                    }
                    return b;
                }
            }, {
                title: '诚信分',
                data: 'memTypeRelas',
                render: function (data, type, row) {
                    if (null == data)
                        return 0;
                    var b = 0;
                    for (var a in data) {
                        if ('诚信积分' == data[a].itrlType.typeName) {
                            b = data[a].currentScore;
                        }
                    }
                    return b;
                }
            }, {
                title: '公益分',
                data: 'memTypeRelas',
                render: function (data, type, row) {
                    if (null == data)
                        return 0;
                    var b = 0;
                    for (var a in data) {
                        if ('公益积分' == data[a].itrlType.typeName) {
                            b = data[a].currentScore;
                        }
                    }
                    return b;
                }
            }, {
                title: '绿色分',
                data: 'memTypeRelas',
                render: function (data, type, row) {
                    if (null == data)
                        return 0;
                    var b = 0;
                    for (var a in data) {
                        if ('绿色积分' == data[a].itrlType.typeName) {
                            b = data[a].currentScore;
                        }
                    }
                    return b;
                }
            }, {
                title: '勋章',
                data: 'memMedalRelas',
                render: function (data, type, row) {
                    if (null == data)
                        return '无';
                    var b = '';
                    for (var a in data) {
                        b += data[a].itrlMedal.medalName + ',';
                    }
                    return b.substring(0, b.length - 1);
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
                title: '实名',
                data: 'memAccountType',
                render: function (data, type, row) {
                    if (data == 0) {
                        return '未实名';
                    } else {
                        return '已实名';
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

    //获取绑定事件
    someClick(info: any) {
        this.itrlMemId = info.id;
    }

    search() {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.draw();
        });
    }

    queryDetail(id) {
        if (id != '') {
            this.router.navigate(['/points/itrlRecord'], {queryParams: {'id': id, 'start': this.pages.start, 'length': this.pages.length}});
        } else {
            this.errorSwal('请先选中一行');
        }
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
                this.element.val(this.startDate.format(this.locale.format) + this.locale.separator + this.endDate.format(this.locale.format));
                that.searchForm.patchValue({
                    startEndTime: this.element.val()
                });
            }

        });

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


    submitUpload() {
        let formData = new FormData();
        if (this.fileList.length > 0) {
            let file: File = this.fileList;
            formData = new FormData(this.fileList);
            formData.append('file', file, file.name);


        } else {
            this.errorSwal('请选择上传文件');
        }

        $.ajax({
            url: SERVER_API_URL + 'integralapp/api/bathSaveMem',
            type: 'POST',
            data: formData,
            enctype: 'multipart/form-data',
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            xhrFields: {withCredentials: true},
            crossDomain: true,
            success: function (data) {
                alert('上传成功');
            },
            error: function () {
                alert('上传失败');
            }
        });

    }

    selectedFileOnChanged(event: any) {
        console.log(event.target.value);
        this.fileList[0] = event.target.value;
    }


    uploadFile() {
        const that = this;
        if (null != this.fileList[0]) {
            this.uploader.queue[0].upload();
            this.uploader.onErrorItem = function (item, response, status, headers) {
                that.errorSwal('上传失败(' + response.substring(response.indexOf('errorKey') + 13, response.indexOf('type') - 7) + ')');
            };
            this.uploader.onSuccessItem = function (item, response, status, headers) {
                that.successSwal('上传成功');
            };
        } else {
            this.errorSwal('请选择上传文件');
        }
    }


    //弹出新增窗口
    showAddModal(result) {
        //重置
        this.saveForm.reset();
        this.mr = this.modalService.open(this.content, {windowClass: 'modal-size-large'});
    }

    saveMem() {
        this.itrlMemDto = this.saveForm.value;
        this.itrlMemService.create(this.itrlMemDto).subscribe((response) => this.onSuccess(response), (error) => this.onError(error));
    }

    onSuccess(response) {
        this.mr.dismiss('cancel');
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            this.successSwal('添加成功');
            dtInstance.ajax.reload();
        });

    }

    onError(error) {
        this.mr.dismiss('cancel');
        this.errorSwal('添加失败')
    }

    checkItrlMemNo() {
        this.itrlMemDto = new ItrlMemDTO();
        this.itrlMemDto.memNo = this.saveForm.value.memNo;
        if (this.itrlMemDto.memNo.length > 0) {
            this.itrlMemService.checkItrlMemNo(this.itrlMemDto).subscribe((response) => {
                if (null === response.body) {
                    this.flag = false;
                } else {
                    this.flag = true;
                }

            }, () => this.errorSwal('验证统一客户号查询数据失败'));
        }
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
