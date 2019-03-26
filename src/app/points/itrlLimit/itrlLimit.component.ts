import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {SERVER_API_URL} from '../../app.constants';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DataTableDirective} from 'angular-datatables';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {HttpClient} from '@angular/common/http';
import {DataTablesResponse} from '../../shared/data-tables-response';
import {ItrlLimitService} from './itrlLimit.service';
import {ItrlLimit, ItrlTypeDTO} from './itrlLimit-dto';
import {DditItemDto} from '../dataItemManage/dditItem-dto';
import {DataItemManagerService} from '../dataItemManage/dataItemManager.service';

declare var $: any;
declare var jQuery: any;
declare var swal: any;

@Component({
    selector: 'app-itrlLimit',
    templateUrl: './itrlLimit.component.html',
    styleUrls: ['./itrlLimit.component.css']
})
export class ItrlLimitComponent implements OnInit {
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    @ViewChild('content') content: TemplateRef<any>;
    dtOptions: DataTables.Settings = {};
    saveForm: FormGroup;
    searchForm: FormGroup;
    mr: NgbModalRef;
    limitParamId: string = '';
    levItrlType: any = [];
    itrlTyLists: any = [{'id': '', 'text': ''}];
    itrlTy: any;
    itrlLimit: ItrlLimit;
    itrlTypeDTO: ItrlTypeDTO;
    dditItemDto: any = new Array<DditItemDto>();
    // 全部规则
    sumLimit: number = 0;
    // 启用规则
    startLimit: number = 0;
    // 标题名称
    titleName: string = '';

    constructor(private fb: FormBuilder,
                private modalService: NgbModal,
                private http: HttpClient,
                private itrlLimitService: ItrlLimitService,
                private dataItemManagerService: DataItemManagerService) {
        this.searchForm = this.fb.group({
            limitNo: '',
            limitStatus: '',
            limitName: '',
            itrlTypeId: ''
        })
    }

    ngOnInit() {
        // 获取积分类别
        this.itrlLimitService.getItrlTy().subscribe((response) => {
            if (null != response.body && response.body.length > 0) {
                this.itrlTy = response.body;
                for (var i in response.body) {
                    if (null == this.itrlTyLists[i]) {
                        this.itrlTyLists.push({'id': '', 'text': ''});
                    }
                    this.itrlTyLists[i].id = response.body[i].id;
                    this.itrlTyLists[i].text = response.body[i].typeName;
                }
            }
        });

        // 获取运算符号
        this.dataItemManagerService.getDditId(1101).subscribe((response) => {
            this.dditItemDto = response.body;
        });

        // 获取规则数
        this.limitNumberSum();

        // 表单验证
        this.saveForm = this.fb.group({
            id: [],
            createDate: [],
            limitNo: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
            limitSymbol: ['', [Validators.required]],
            limitRemark: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
            limitStatus: ['', [Validators.required]],
            limitLev: ['', [Validators.required]],
            limitScore: ['', [Validators.required]],
            limitName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(18)]]
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
                    SERVER_API_URL + 'integralapp/api/itrlLimitsPages' + '?draw=' + dataTablesParameters.draw + '&start=' + dataTablesParameters.start + '&length=' + dataTablesParameters.length,
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
                title: '规则序号',
                data: 'limitNo'
            }, {
                title: '规则级别',
                data: 'limitLev'
            }, {
                title: '规则名称',
                data: 'limitName'
            }, {
                title: '所属积分类别',
                data: 'itrlTies',
                render: function (data, type, row) {
                    if (null == data)
                        return '';
                    var b = '';
                    for (var a in data) {
                        b += data[a].typeName + ',';
                    }
                    return b.substring(0, b.length - 1);
                }
            }, {
                title: '运算符号',
                data: 'dditItemSymbol'
            }, {
                title: '规则值',
                data: 'limitScore'
            }, {
                title: '规则状态',
                data: 'limitStatus',
                render: function (data, type, row) {
                    if (data == 0) {
                        return '禁用';
                    } else
                        return '启用';
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
                title: '规则说明',
                data: 'limitRemark'
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
            // 清空数组
            this.levItrlType = [];
            // 标题名称
            this.titleName = '新增';
            // 清空
            this.saveForm.reset();
            this.saveForm.patchValue({'limitNo': 'RS_'});
        }
        const that = this;
        // select 插件必须要用jquery来写
        $(function () {
            $('#select2').select2({
                data: that.itrlTyLists
            });
            $('#select2').val(that.levItrlType).trigger('change');
            $('.select2-tags').select2({
                tags: true,
                tokenSeparators: [',', ' ']
            });
            $('.selectpicker').selectpicker();
        });
        this.mr = this.modalService.open(this.content);
    }

    // 获取绑定事件
    someClick(info: any) {
        this.limitParamId = info.id;
    }

    // 清空id
    clearParam() {
        this.limitParamId = '';
    }

    // 保存
    saveDdit() {
        const that = this;
        $(function () {
            // 获取select2 插件下拉框的多选值 数组
            var value = $('#select2').select2('val');
            that.save(value);
        });

    }

    flag: boolean;

    checkCode() {
        this.itrlLimit = new ItrlLimit();
        this.itrlLimit.id = this.saveForm.value.id;
        this.itrlLimit.limitNo = this.saveForm.value.limitNo;
        if (this.saveForm.value.limitNo.length > 0) {
            this.itrlLimitService.checkItrlLimitCode(this.itrlLimit).subscribe((response) => this.onCheckSuccess(response));
        }
    }

    // 统计规则数
    limitNumberSum() {
        this.itrlLimit = new ItrlLimit();
        this.itrlLimitService.getItrlLimitLists(this.itrlLimit).subscribe((response) => this.onGetListSuccess(response));
    }

    save(value) {
        this.itrlLimit = this.saveForm.value;
        this.itrlLimit.itrlTies = new Array<ItrlTypeDTO>();
        for (var i in value) {
            this.itrlTypeDTO = new ItrlTypeDTO();
            this.itrlTypeDTO.id = value[i];
            this.itrlLimit.itrlTies[i] = this.itrlTypeDTO;
        }
        this.itrlLimitService.edit(this.itrlLimit).subscribe((response) => this.onEditSuccess(response), () => this.onUpdateError());
    }

    // 获取
    getDdit(id) {
        if (id != '') {
            this.flag = false;
            this.itrlLimitService.get(id).subscribe((response) => this.onGetLevSuccess(response), () => this.onGetError());
        } else {
            this.errorSwal('请先选中一行');
        }
    }

    // get 获取成功
    private onGetLevSuccess(result) {
        // 赋值
        this.saveForm.setValue({
            'id': result.body.id,
            'createDate': result.body.createDate,
            'limitNo': result.body.limitNo,
            'limitName': result.body.limitName,
            'limitStatus': result.body.limitStatus,
            'limitLev': result.body.limitLev,
            'limitSymbol': result.body.limitSymbol,
            'limitScore': result.body.limitScore,
            'limitRemark': result.body.limitRemark
        });
        // 清空数组
        this.levItrlType = [];
        if (null != result.body.itrlTies && result.body.itrlTies.length > 0) {
            for (var i in result.body.itrlTies) {
                if (null == this.levItrlType[i]) {
                    this.levItrlType.push('');
                }
                this.levItrlType[i] = result.body.itrlTies[i].id;
            }
        }
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
        this.itrlLimit = null;
        //清空id
        this.clearParam();
        //获取规则数
        this.limitNumberSum();
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

    //查询集合
    private onGetListSuccess(response) {
        //重置统计数
        this.startLimit = 0;
        for (var i in response.body) {
            if (1 == response.body[i].limitStatus) {
                ++this.startLimit;
            }
        }
        this.sumLimit = response.body.length;
    }

    //检查返回成功
    private onCheckSuccess(response) {
        //清空对象
        this.itrlLimit = null;
        this.flag = response.body;
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
