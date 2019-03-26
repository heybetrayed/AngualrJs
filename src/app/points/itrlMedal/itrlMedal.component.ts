import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {SERVER_API_URL} from '../../app.constants';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {DataTablesResponse} from '../../shared/data-tables-response';
import {DataTableDirective} from 'angular-datatables';
import {ItrlMedalService} from './itrlMedal.service';
import * as moment from 'moment';
import {ItrlMedalDTO, MedalTypeRelaDTO} from './itrlMedal-dto';

declare var $: any;
declare var jQuery: any;
declare var swal: any;

@Component({
    selector: 'app-itrlLev',
    templateUrl: './itrlMedal.component.html',
    styleUrls: ['./itrlMedalcomponent.css'],

})
export class ItrlMedalComponent implements OnInit {
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    @ViewChild('content') content: TemplateRef<any>;
    dtOptions: any = {};
    saveForm: FormGroup;
    searchForm: FormGroup;
    mr: NgbModalRef;
    //ID
    medalId: string = '';
    //会员勋章
    itrlMedalDTO: ItrlMedalDTO;
    //类别勋章限制
    medalTypeRelaDTO: MedalTypeRelaDTO;
    //数组
    itrlMedalType: any = [{'itrlTypeId': '', 'converScore': ''}];
    //积分类型实体
    itrlType: any;
    //标题名称
    titleName: string = '';

    constructor(private fb: FormBuilder,
                private modalService: NgbModal,
                private http: HttpClient,
                private itrlMedalService: ItrlMedalService) {
        this.searchForm = this.fb.group({
            medalName: '',
            xfValue: '',
            cxValue: '',
            gyValue: '',
            lsValue: '',
            medalStatus: '',
            medalNo: ''
        })
    }

    ngOnInit() {
        //获取积分类别
        this.itrlMedalService.getItrlTy().subscribe((response) => {
            this.itrlType = response.body;
        });
        //表单验证
        this.saveForm = this.fb.group({
            id: [],
            numberId: [],
            medalRemark: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
            medalNo: ['', [Validators.required]],
            medalStatus: ['', [Validators.required]],
            medalName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(8)]]
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
                    SERVER_API_URL + 'integralapp/api/itrlMedalsPages' + '?draw=' + dataTablesParameters.draw + '&start=' + dataTablesParameters.start + '&length=' + dataTablesParameters.length,
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
                title: '标签',
                data: 'medalName'
            }, {
                title: '消费分要求',
                data: 'medalTypeRelas',
                render: function (data, type, row) {
                    if (null == data)
                        return '';
                    var b = '';
                    for (var a in data) {
                        if (null != data[a].itrlType) {
                            if ('消费积分' == data[a].itrlType.typeName) {
                                b += data[a].converSymbol + data[a].converScore;
                                break;
                            }
                        }
                    }
                    return b;
                }
            }, {
                title: '诚信分要求',
                data: 'medalTypeRelas',
                render: function (data, type, row) {
                    if (null == data)
                        return '';
                    var b = '';
                    for (var a in data) {
                        if (null != data[a].itrlType) {
                            if ('诚信积分' == data[a].itrlType.typeName) {
                                b += data[a].converSymbol + data[a].converScore;
                                break;
                            }
                        }
                    }
                    return b;
                }
            }, {
                title: '公益分要求',
                data: 'medalTypeRelas',
                render: function (data, type, row) {
                    if (null == data)
                        return '';
                    var b = '';
                    for (var a in data) {
                        if (null != data[a].itrlType) {
                            if ('公益积分' == data[a].itrlType.typeName) {
                                b += data[a].converSymbol + data[a].converScore;
                                break;
                            }
                        }
                    }
                    return b;
                }
            }, {
                title: '绿色分要求',
                data: 'medalTypeRelas',
                render: function (data, type, row) {
                    if (null == data)
                        return '';
                    var b = '';
                    for (var a in data) {
                        if (null != data[a].itrlType) {
                            if ('绿色积分' == data[a].itrlType.typeName) {
                                b += data[a].converSymbol + data[a].converScore;
                                break;
                            }
                        }
                    }
                    return b;
                }
            }, {
                title: '标签说明',
                data: 'medalRemark'
            }, {
                title: '等级级别',
                data: 'medalNo'
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
                data: 'medalStatus',
                render: function (data, type, row) {
                    if (data == 0) {
                        return '禁用';
                    } else
                        return '启用';
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


    addInput() {
        if (this.itrlMedalType.length == this.itrlType.length) {
            this.errorSwal('添加已上限');
            return;
        }
        this.itrlMedalType.push({'itrlTypeId': '', 'converScore': ''});
    }

    addRemove(item) {
        if (this.itrlMedalType.length <= 1) {
            this.errorSwal('至少有一个');
            return;
        }
        let i = this.itrlMedalType.indexOf(item);
        this.itrlMedalType.splice(i, 1);
    }

    //获取绑定事件
    someClick(info: any) {
        this.medalId = info.id;
    }

    //清空id
    clearParam() {
        this.medalId = '';
    }

    //弹出新增窗口 ture 清空值  false 不清空
    showAddModal(result) {
        if (result) {
            this.titleName = '新增';
            //重置
            this.saveForm.reset();
            //赋值
            this.saveForm.setValue({
                'id': '',
                'numberId': '系统自动生成',
                'medalName': '',
                'medalNo': '',
                'medalStatus': '',
                'medalRemark': ''
            });
            this.itrlMedalType = [{'itrlTypeId': '', 'converScore': ''}];
        }
        this.mr = this.modalService.open(this.content);
    }

    //获取
    getDdit(id) {
        if (id != '') {
            this.itrlMedalType = [{'itrlTypeId': '', 'converScore': ''}];
            this.itrlMedalService.get(id).subscribe((response) => this.onGetLevSuccess(response), () => this.onGetError());
        } else {
            this.errorSwal('请先选中一行');
        }
    }

    //查询
    search() {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.draw();
        });
    }

    //保存
    saveDdit() {
        this.itrlMedalDTO = this.saveForm.value;
        this.itrlMedalDTO.medalTypeRelas = new Array<MedalTypeRelaDTO>();
        for (var i in this.itrlMedalType) {
            this.medalTypeRelaDTO = new MedalTypeRelaDTO();
            this.medalTypeRelaDTO.itrlMedalId = this.saveForm.value.id;
            if ('' != this.itrlMedalType[i].itrlTypeId) {
                this.medalTypeRelaDTO.itrlTypeId = this.itrlMedalType[i].itrlTypeId;
            } else {
                this.errorSwal('积分类型不能为空');
                break;
            }
            //这里加String() 是用来处理0与""的问题 alert(0=="") 结果是true 所以先把0转换为String(0) ->"0"
            if (null != this.itrlMedalType[i].converScore && '' != String(this.itrlMedalType[i].converScore)) {
                this.medalTypeRelaDTO.converScore = this.itrlMedalType[i].converScore;
            } else {
                this.errorSwal('分数不能为空');
                break;
            }
            this.medalTypeRelaDTO.converSymbol = '>=';
            this.itrlMedalDTO.medalTypeRelas[i] = this.medalTypeRelaDTO;
            if (parseInt(i) == (this.itrlMedalType.length - 1)) {
                if ('' == this.saveForm.value.id) {
                    this.itrlMedalDTO.id = null;
                }
                //edit
                this.itrlMedalService.edit(this.itrlMedalDTO).subscribe((response) => this.onEditSuccess(response), () => this.onUpdateError());
            }
        }
    }

    //删除
    deleteDdit(id) {
        const that = this;
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
                        that.itrlMedalService.get(id).subscribe((response) => that.inGetSuccess(response), () => that.onGetError());
                    }
                }
            });
    }

    //编辑返回成功
    private onEditSuccess(result) {
        if (null != result.body.id) {
            //关闭modal
            this.mr.dismiss('cancel');
            //对象赋值为空
            this.itrlMedalDTO = null;
            //清空id
            this.clearParam();
            //弹出框
            this.successSwal('成功');
            //刷新表格
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                dtInstance.ajax.reload();
            });
        }
    }

    //保存返回成功
    private onSaveSuccess(result) {
        //对象赋值为空
        this.itrlMedalDTO = null;
        //清空id
        this.clearParam();
        //弹出框
        this.successSwal('删除成功');
        //刷新表格
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
    }

    //get 获取成功
    private onGetLevSuccess(result) {
        this.saveForm.setValue({
            'id': result.body.id,
            'numberId': result.body.id,
            'medalName': result.body.medalName,
            'medalNo': result.body.medalNo,
            'medalStatus': result.body.medalStatus,
            'medalRemark': result.body.medalRemark
        });
        if (null != result.body.medalTypeRelas) {
            for (var i in result.body.medalTypeRelas) {
                if (null == this.itrlMedalType[i]) {
                    this.itrlMedalType.push({'itrlTypeId': '', 'converScore': ''});
                }
                this.itrlMedalType[i].itrlTypeId = result.body.medalTypeRelas[i].itrlType.id;
                this.itrlMedalType[i].converScore = result.body.medalTypeRelas[i].converScore;
            }
        }
        this.titleName = '编辑';
        //弹出窗口
        this.showAddModal(false);
    }

    //save 积分类别 与 等级关系表 成功
    private onGetLevItrlSuccess(result): void {
        this.medalTypeRelaDTO = null;
    }

    //获取失败
    private onGetError() {
        this.errorSwal('获取失败');
    }

    //修改失败
    private onUpdateError() {
        this.errorSwal('失败');
    }

    //删除失败
    private onDeleteError() {
        this.errorSwal('删除失败');
    }

    //get 返回成功
    private inGetSuccess(result) {
        this.itrlMedalDTO = result.body;
        //改一下状态
        this.itrlMedalDTO.medalStatus = '0';
        //edit
        this.itrlMedalService.editLev(this.itrlMedalDTO).subscribe((response) => this.onSaveSuccess(response), () => this.onUpdateError());
    }

    dateRangePicker() {
        const that = this;
        const picker: any = $('#startEndTime');
        const dataRageOption: Object = {
            'timePicker': false,
            'timePicker24Hour': false,
            'drops': 'down',
            'opens': 'left',
            'ranges': {
                '今日': [moment().startOf('day'), moment()],
                '昨日': [moment().subtract('days', 1).startOf('day'), moment().subtract('days', 1).endOf('day')],
                '最近7日': [moment().subtract('days', 6), moment()],
                '最近30日': [moment().subtract('days', 29), moment()]
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
            },
            'endDate': moment()
        };
        picker.daterangepicker(dataRageOption, function (start, end, label) {
            this.element.val(this.startDate.format(this.locale.format) + this.locale.separator + this.endDate.format(this.locale.format))
            that.searchForm.patchValue({
                startEndTime: this.element.val()
            });
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

    checkItrlTy(tyIdx) {
        for (var i in this.itrlMedalType) {
            if (this.itrlMedalType[tyIdx].itrlTypeId == this.itrlMedalType[i].itrlTypeId && tyIdx != i) {
                $('.ng-dirty').eq(tyIdx).val('');
                this.itrlMedalType[tyIdx].itrlTypeId = null;
                this.errorSwal('当前积分类型不能重复选中');
                return;
            }
        }
    }
}
