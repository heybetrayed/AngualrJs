import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {SERVER_API_URL} from '../../app.constants';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {DataTableDirective} from 'angular-datatables';
import {HttpClient} from '@angular/common/http';
import {DataTablesResponse} from '../../shared/data-tables-response';
import {ItrlChangeService} from './itrlChange.service';
import {ItrlLimitService} from '../itrlLimit/itrlLimit.service';
import {ItrlTypeChangeRelaDTO} from './itrlTypeChangeRelaDTO';
import {ItrlChangeDTO} from './itrlChangeDTO';
import {ItrlLimit} from '../itrlLimit/itrlLimit-dto';
import {ChangeProductRelaDTO} from './changeProductRelaDTO';
import {CemsdfService} from '../../boccommon/cemsdf/cemsdf.service';
import {ResponseWrapper} from '../../core/http/response-wrapper.model';
import {CemSdfDto} from '../../boccommon/cemsdf/cemsdf-dto';
import {ItrlTypeDTO} from '../itrlType/itrlType-dto';


declare var $: any;
declare var jQuery: any;
declare var swal: any;


@Component({
    selector: 'app-itrlChange',
    templateUrl: './itrlChange.component.html',
    styleUrls: ['./itrlChange.component.css'],
    providers: [ItrlLimitService]

})
export class ItrlChangeComponent implements OnInit {
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    @ViewChild('content') content: TemplateRef<any>;
    @ViewChild('joinLimit') joinLimit: TemplateRef<any>;
    @ViewChild('joinProduct') joinProduct: TemplateRef<any>;
    dtOptions: DataTables.Settings = {};
    saveForm: FormGroup;
    saveLimitForm: FormGroup;
    saveProductForm: FormGroup;
    searchForm: FormGroup;
    searchLimitForm: FormGroup;
    searchProductForm: FormGroup;
    mr: NgbModalRef;
    itrlTypeChangeRelaDTO: ItrlTypeChangeRelaDTO;
    itrlLimitdto: ItrlLimit;
    contentModal: any;
    index: number = 1;
    changeId: string = '';
    isChangeName: boolean;
    //启用规则
    startUsingChange: number = 0;
    //全部规则
    sumChange: number = 0;
    limitTy: any = [{'itrlTy': '', 'changeSign': '', 'changeScore': '', 'typeStatus': 1, 'changeFrequency': ''}];
    itrlTyArray: any = [];

    itrlProductArray: any = [{'id': '', 'text': ''}];
    applicationError: any;

    selectItrlTy: any = [];
    noProductArr: CemSdfDto[];

    itrlChangeDTO: ItrlChangeDTO;
    // 标题名称
    titleName: string = '';


    constructor(private fb: FormBuilder, private modalService: NgbModal, private http: HttpClient,
                private itrlChangeService: ItrlChangeService,
                private itrlLimitService: ItrlLimitService, private cemsdfService: CemsdfService) {
        this.searchForm = this.fb.group({
            changeNo: '',
            changeStatus: '',
            changeName: '',
            productId: ''
        });
        this.searchLimitForm = this.fb.group({
            limitNo: '',
            limitStatus: '',
            limitName: '',
            itrlTypeId: ''
        });
        this.searchProductForm = this.fb.group({
            productCode: '',
            productName: ''
        });


    }

    ngOnInit() {
        this.cemsdfService.getCemSdfs({size: 9999}).subscribe(
            response => {
                this.noProductArr = response.body;
            }
        );

        this.startUsingChangeSum();
        this.sumChangeCount();

        $(function () {
            $('.select2').select2();
            $('.select2-tags').select2({
                tags: true,
                tokenSeparators: [',', ' ']
            });
        });

        //表单验证
        this.saveForm = this.fb.group({
            id: [],
            changeNo: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
            changeName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
            changeStatus: ['', [Validators.required]],
            changeMemStatus: ['', [Validators.required]],
            changeRemark: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
            changeFrequency: ['', [Validators.required, Validators.minLength(1), Validators.min(0), Validators.pattern('^([0-9]*)$')]]
        });

        this.saveLimitForm = this.fb.group({});

        this.saveProductForm = this.fb.group(
            {}
        );

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
                    SERVER_API_URL + 'integralapp/api/itrlChangesPages' + '?draw=' + dataTablesParameters.draw + '&start=' + dataTablesParameters.start + '&length=' + dataTablesParameters.length,
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
                data: 'changeNo'
            }, {
                title: '规则名称',
                data: 'changeName'
            }, {
                title: '消费积分类型',
                data: 'itrlTypeChangeRelas',
                render: function (data, type, row) {
                    var b = '';
                    for (var a in data) {
                        if (null != data[a].itrlType) {
                            if ('消费积分' == data[a].itrlType.typeName) {
                                if ('+' == data[a].changeSign)
                                    b = '加';
                                else if ('-' == data[a].changeSign)
                                    b = '减';
                                else if ('*' == data[a].changeSign)
                                    b = '乘';
                                else if ('/' == data[a].changeSign)
                                    b = '除';
                                else if ('%' == data[a].changeSign)
                                    b = '百分';
                                b += data[a].changeScore;
                            }
                        }
                    }
                    return b;
                }
            }, {
                title: '关联限制规则编号',
                data: 'itrlLimits',
                render: function (data, type, row) {
                    var append = '';
                    if (null != data) {
                        for (var a in data) {
                            append += data[a].limitNo + ',';
                        }
                        append = append.substring(0, append.length - 1);
                    }
                    return append;
                }
            }, {
                title: '关联产品编号',
                data: 'changeProduct',
                render: function (data, type, row) {
                    var append = '';
                    if (null != data) {
                        for (var a in data) {
                            append += data[a].productCode + ',';
                        }
                        append = append.substring(0, append.length - 1);
                    }
                    return append;
                }
            }, {
                title: '客户账户状态',
                data: 'changeMemStatus',
                render: function (data, type, row) {
                    if (data == 0) {
                        return '禁用';
                    } else {
                        return '启用';
                    }
                }
            }, {
                title: '规则状态',
                data: 'changeStatus',
                render: function (data, type, row) {
                    if (data == 0) {
                        return '禁用';
                    } else {
                        return '启用';
                    }
                },
            }, {
                title: '调用频率',
                data: 'changeFrequency'
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
                data: 'changeRemark'
            }
            ],
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
        this.changeId = info.id;
    }

    //弹出新增窗口
    showAddModal(result) {
        this.titleName = '编辑';
        if (result) {
            this.titleName = '新增';
            //重置
            this.saveForm.reset();
            //赋值
            this.saveForm.patchValue({'changeNo': 'HQ-'});

            this.limitTy = [{'itrlTy': '', 'changeSign': '', 'changeScore': '', 'typeStatus': 1, 'changeFrequency': '',}];
            this.selectItrlTy = [];
        }

        this.getItrlTy();
        this.mr = this.modalService.open(this.content, {windowClass: 'modal-size-large'});
    }


    //get 获取成功
    private onGetLimitSuccess(result) {
        this.saveForm.setValue({
            'id': result.body.id,
            'changeNo': result.body.changeNo,
            'changeName': result.body.changeName,
            'changeRemark': result.body.changeRemark,
            'changeStatus': result.body.changeStatus,
            'changeMemStatus': result.body.changeMemStatus,
            'changeFrequency': result.body.changeFrequency
        });
        this.limitTy = [];
        if (null != result.body.itrlTypeChangeRelas) {
            for (var i in result.body.itrlTypeChangeRelas) {
                this.limitTy.push({
                    'itrlTy': result.body.itrlTypeChangeRelas[i].itrlType.id,
                    'changeSign': result.body.itrlTypeChangeRelas[i].changeSign,
                    'changeScore': String(result.body.itrlTypeChangeRelas[i].changeScore),
                    'typeStatus': String(result.body.itrlTypeChangeRelas[i].typeStatus)
                });

            }
        }
        this.productArr = result.body.changeProduct;
        this.limitArr = result.body.itrlLimits;
        this.getItrlTy();
        //弹出窗口
        this.showAddModal(false);
    }

    //获取
    getDdit(changeId) {
        if (changeId != '') {
            this.itrlChangeService.get(changeId).subscribe((response) => this.onGetLimitSuccess(response), () => this.onGetError('获取规则'));
        } else {
            this.onSelectOne();
        }
    }

    //查询积分类型
    getItrlTy() {
        this.itrlLimitService.getItrlTy().subscribe((response) => this.itrlTyArray = response.body, () => this.onGetError('积分类型'));
    }


    //保存
    saveLimit() {
        this.itrlChangeDTO = this.saveForm.value;
        this.itrlChangeDTO.itrlTypeChangeRelas = new Array<ItrlTypeChangeRelaDTO>();
        for (var i in this.limitTy) {
            this.itrlTypeChangeRelaDTO = new ItrlTypeChangeRelaDTO();
            if ('' != this.limitTy[i].itrlTy) {
                this.itrlTypeChangeRelaDTO.itrlType = new ItrlTypeDTO();
                this.itrlTypeChangeRelaDTO.itrlType.id = this.limitTy[i].itrlTy;
            } else {
                this.errorSwal('积分类型不能为空');
                break;
            }
            if ('' != this.limitTy[i].changeSign) {
                this.itrlTypeChangeRelaDTO.changeSign = this.limitTy[i].changeSign;
            } else {
                this.errorSwal('对比符号不能为空');
                break;
            }
            if ('' != this.limitTy[i].changeScore && null != this.limitTy[i].changeScore) {
                this.itrlTypeChangeRelaDTO.changeScore = this.limitTy[i].changeScore;
            } else {
                this.errorSwal('规则积分不能为空');
                break;
            }
            if (0 == this.limitTy[i].typeStatus || 1 == this.limitTy[i].typeStatus) {
                this.itrlTypeChangeRelaDTO.typeStatus = this.limitTy[i].typeStatus;
            } else {
                this.errorSwal('状态不能为空');
                break;
            }
            this.itrlTypeChangeRelaDTO.itrlChangeId = this.saveForm.value.id;
            this.itrlChangeDTO.itrlTypeChangeRelas[i] = this.itrlTypeChangeRelaDTO;
            if (parseInt(i) == this.limitTy.length - 1) {
                this.itrlChangeDTO.itrlLimits = this.limitArr;
                this.itrlChangeDTO.changeProduct = this.productArr;
                this.itrlChangeService.edit(this.itrlChangeDTO).subscribe((response) => this.onSaveSuccess(response, this.saveForm.value.id), () => this.onSaveError());
            }
        }
    }


    private onSaveSuccess(result, id) {
        //关闭modal
        this.mr.dismiss('cancel');
        //保存成功，刷新表单
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            if (id == '') {
                this.successSwal('成功');
            } else {
                this.successSwal('成功');
            }
            dtInstance.ajax.reload();
            this.startUsingChangeSum();
            this.sumChangeCount();
        });
    }


    search() {
        //清空id
        this.changeId = '';
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.draw();
        });
    }


    addInput() {
        if (this.limitTy.length == this.itrlTyArray.length) {
            this.onAddError('');
            return;
        }
        this.limitTy.push({'itrlTy': '', 'changeSign': '', 'changeScore': '', 'typeStatus': 1, 'changeFrequency': ''})
    }

    //
    addRemove(item) {
        if (this.limitTy.length <= 1) {
            this.onSelectOne();
            return;
        }
        let i = this.limitTy.indexOf(item);
        this.limitTy.splice(i, 1);
        this.selectItrlTy.push(i, 1);
    }

    noLimitArr: any = [];
    limitArr: any = [];

    //添加选中限制规则
    addCopyParam(idx) {
        for (var i in this.limitArr) {
            if (this.limitArr[i].limitNo == this.noLimitArr[idx].limitNo && this.limitArr[i].limitName == this.noLimitArr[idx].limitName) {
                return;
            }
        }
        this.limitArr.push(this.noLimitArr[idx]);
        this.noLimitArr.splice(idx, 1);
    }

    //删除选中限制规则
    removeParam(idx) {
        this.noLimitArr.push(this.limitArr[idx]);
        this.limitArr.splice(idx, 1)

    }


    //弹出处理获取规则和限制规则关系页面
    showJoinLimit(changeId) {
        this.getItrlTy();
        this.itrlLimitdto = new ItrlLimit();
        if (changeId != '') {
            this.itrlChangeService.get(changeId).subscribe((response) => this.getLimit(response), () => this.onGetError('获取规则'));
            //查询状态为启用
            this.itrlLimitdto.limitStatus = 1;
            this.itrlLimitService.getItrlLimitLists(this.itrlLimitdto).subscribe((response) => this.disposeParam(response), () => this.onGetError('限制规则'));
            this.mr = this.modalService.open(this.joinLimit, {windowClass: 'modal-size-large'});
        } else {
            this.onSelectOne();
        }
    }

    //弹出框初始化未选中的限制规则
    disposeParam(result) {

        this.noLimitArr = result.body;
        for (var i in this.noLimitArr) {
            for (var j in this.limitArr) {
                if (this.noLimitArr[i].limitNo == this.limitArr[j].limitNo && this.noLimitArr[i].limitName == this.limitArr[j].limitName) {
                    this.noLimitArr.splice(i, 1);
                }
            }
        }
    }

    //获取规则和限制规则
    getLimit(result) {
        this.itrlChangeDTO = result.body;
        this.limitArr = result.body.itrlLimits;


    }

    //查询限制规则
    searchParam() {
        this.itrlLimitdto = this.searchLimitForm.value;
        this.itrlLimitService.getItrlLimitLists(this.itrlLimitdto).subscribe((response) => this.noLimitArr = response.body, () => this.onGetError('选中限制规则'));
    }

    //添加获取规则关联限制规则关系
    saveJoinParam() {
        this.itrlChangeDTO.itrlLimits = this.limitArr;
        this.itrlChangeService.edit(this.itrlChangeDTO).subscribe((response) => this.onSaveSuccess(response, this.itrlChangeDTO.id), () => this.onSaveError());
    }


    productArr: any = [];

    // 弹出新增窗口
    showJoinProduct(changeId) {

        if (changeId == null || changeId == '') {
            // 清空数组
            this.productArr = [];
            // 清空
            this.saveForm.reset();
            this.onSelectOne();

            return false;
        } else {
            // 清空数组
            this.productArr = [];
            // 清空
            this.saveForm.reset();
            this.itrlChangeService.get(changeId).subscribe((response) => this.getProduct(response), () => this.onGetError('选中产品'));
        }

        this.mr = this.modalService.open(this.joinProduct);
    }

    //添加获取规则关联产品的关系
    cprDto: ChangeProductRelaDTO;

    saveJoinProduct(value) {
        this.itrlChangeDTO.changeProduct = new Array<ChangeProductRelaDTO>();
        for (var i in value) {
            this.cprDto = new ChangeProductRelaDTO();
            for (let sdf of this.noProductArr) {
                if (value[i] == sdf.sdfCreLineCode) {
                    this.cprDto.productCode = sdf.sdfCreLineCode;
                    this.cprDto.productName = sdf.sdfCreditChinese;
                    this.itrlChangeDTO.changeProduct[i] = this.cprDto;
                }
            }
        }

        this.itrlChangeService.updateChangeProduct(this.itrlChangeDTO).subscribe((response) => this.onSaveSuccess(response, this.itrlChangeDTO.id), () => this.onSaveError());
    }

    // 保存
    saveProduct() {
        const that = this;
        $(function () {
            // 获取select2 插件下拉框的多选值 数组
            var value = $('#select2').select2('val');
            that.saveJoinProduct(value);
        });
    }

    //获取默认关联产品
    getProduct(result) {
        this.itrlChangeDTO = result.body;
        /*this.productArr = result.body.changeProduct;*/
        for (var i in result.body.changeProduct) {
            this.productArr.push(result.body.changeProduct[i].productCode);
        }
        const that = this;
        // select 插件必须要用jquery来写
        $(function () {
            $('#select2').select2({
                data: that.noProductArr
            });
            $('#select2').val(that.productArr).trigger('change');
            $('.select2-tags').select2({
                tags: true,
                tokenSeparators: [',', ' ']
            });
            $('.selectpicker').selectpicker();
        });
    }

    data: any;

    //查询规则数量
    startUsingChangeSum() {
        //启用规则
        this.itrlChangeDTO = new ItrlChangeDTO();
        this.itrlChangeDTO.changeStatus = 1;
        this.itrlChangeService.findChangeCount(this.itrlChangeDTO).subscribe((response) => this.startUsingChange = response.body);
    }


    sumChangeCount() {
        this.itrlChangeDTO = new ItrlChangeDTO();
        this.itrlChangeService.findChangeCount(this.itrlChangeDTO).subscribe((response) => this.sumChange = response.body);
    }

    flag: boolean;

    checkNo() {

        this.itrlChangeDTO = new ItrlChangeDTO();
        this.itrlChangeDTO.changeNo = this.saveForm.value.changeNo;
        this.itrlChangeDTO.id = this.saveForm.value.id;
        if (this.itrlChangeDTO.changeNo.length > 0) {
            this.itrlChangeService.checkName(this.itrlChangeDTO).subscribe((response) => this.flag = response.body, () => this.onSaveError());
        }


    }


    //get 获取失败
    private onGetError(message) {
        this.errorSwal(message + '获取失败');
    }

    //修改失败
    // private onUpdateError() {
    //     //关闭modal
    //     this.mr.dismiss('cancel');
    //     this.errorSwal('修改失败');
    // }

    private onSaveError() {
        //关闭modal
        this.mr.dismiss('cancel');
        this.errorSwal('失败');
    }

    private onAddError(message) {
        this.errorSwal(message + '不能继续添加');
    }

    private onSelectOne() {
        this.errorSwal('请先选中一行');
    }

    private onCheckSelectItrlTy() {
        this.errorSwal('当前积分类型不能重复选择');
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

    checkItrlTy(tyIdx) {

        for (var i in this.limitTy) {
            if (this.limitTy[tyIdx].itrlTy == this.limitTy[i].itrlTy && tyIdx != i) {
                $('.ng-dirty').eq(tyIdx).val('');
                this.limitTy[tyIdx].itrlTy = null;
                this.onCheckSelectItrlTy();
                return;
            }
        }
    }


    checkChangeFrequency() {
        this.itrlChangeDTO = new ItrlChangeDTO();
        this.itrlChangeDTO = this.searchForm.value;
        if (this.itrlChangeDTO.changeFrequency < 0) {
            this.errorSwal('调用频率不能小于等于0');
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

    private onSuccess(data, headers) {

    }

    private onError(error) {
        this.applicationError = error.message;
    }

}
