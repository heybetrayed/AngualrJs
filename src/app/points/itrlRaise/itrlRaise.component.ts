import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DataTableDirective} from 'angular-datatables';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {HttpClient} from '@angular/common/http';
import {ItrlRaiseService} from './itrlRaise.service';
import {ItrlLimitService} from '../itrlLimit/itrlLimit.service';
import {ItrlTypeHelperDto, RaiseItrlDTO} from './itrlRaise-dto';
import {ItrlMemService} from '../itrlMem/itrlMem.service';
import {ItrlChangeService} from '../itrlChange/itrlChange.service';

declare var $: any;
declare var jQuery: any;
declare var swal: any;

@Component({
    selector: 'app-ItrlRaise',
    templateUrl: './itrlRaise.component.html'
})
export class ItrlRaiseComponent implements OnInit {
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    saveForm: FormGroup;
    searchForm: FormGroup;
    mr: NgbModalRef;
    //积分类别对象
    itrlTy: any;
    //获取规则
    itrlChange: any;
    //参数对象
    raiseItrlDTO: any = new RaiseItrlDTO();
    itrlTypeHelperDto: any = new ItrlTypeHelperDto();
    itrlTypeList: any = [{'itrlType': '', 'itrlNumber': ''}];
    //查询返回值
    result: string;

    constructor(private fb: FormBuilder,
                private modalService: NgbModal,
                private http: HttpClient,
                private itrlRaiseService: ItrlRaiseService,
                private itrlChangeService: ItrlChangeService,
                private itrlMemService: ItrlMemService,
                private itrlLimitService: ItrlLimitService) {
        this.searchForm = this.fb.group({
            tinkerCause: '',
            itrlSource: '',
            memNo: '',
            changeNo: ''
        })
    }

    ngOnInit() {

        this.itrlTypeList = [{'itrlType': '', 'itrlNumber': ''}];
        // 表单验证
        this.searchForm = this.fb.group({
            tinkerCause: ['', [Validators.required]],
            itrlSource: ['', [Validators.required]],
            memNo: ['', [Validators.required]],
            changeNo: ['', [Validators.required]]
        });

        //获取获取规则
        this.itrlChangeService.getAllItrlChanges().subscribe((response) => {
            this.itrlChange = response.body;
        });
        // 获取积分类别
        this.itrlLimitService.getItrlTy().subscribe((response) => {
            this.itrlTy = response.body;
        });
    }

    addInput() {
        if (this.itrlTypeList.length == this.itrlTy.length) {
            this.errorSwal('添加已上限');
            return;
        }
        this.itrlTypeList.push({'itrlType': '', 'itrlNumber': ''});
    }

    addRemove(item) {
        if (this.itrlTypeList.length <= 1) {
            this.errorSwal('至少有一个');
            return;
        }
        let i = this.itrlTypeList.indexOf(item);
        this.itrlTypeList.splice(i, 1);
    }

    checkItrlTy(tyIdx) {
        for (var i in this.itrlTypeList) {
            if (this.itrlTypeList[tyIdx].itrlType == this.itrlTypeList[i].itrlType && tyIdx != i) {
                $('.ng-dirty').eq(tyIdx).val('');
                this.itrlTypeList[tyIdx].itrlType = null;
                this.errorSwal('当前积分类型不能重复选中');
                return;
            }
        }
    }

    // 查询
    search() {
        this.result = '';
        this.raiseItrlDTO = this.searchForm.value;
        this.raiseItrlDTO.itrlTypeList = new Array(ItrlTypeHelperDto);
        for (let i in this.itrlTypeList) {
            this.itrlTypeHelperDto = new ItrlTypeHelperDto();
            this.itrlTypeHelperDto.itrlType = this.itrlTypeList[i].itrlType;
            this.itrlTypeHelperDto.itrlNumber = this.itrlTypeList[i].itrlNumber;
            this.raiseItrlDTO.itrlTypeList[i] = this.itrlTypeHelperDto;
        }
        this.itrlRaiseService.getItrlRaise(this.raiseItrlDTO).subscribe((response) => {
            if (null === response.body) {
                this.result = '新增积分成功!';
            } else if (null != response.body) {
                this.result = JSON.stringify(response.body[0]);
            }
        }, (error) => this.onGetError(error));
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

    private onGetError(error) {
        this.result = error._body;
    }
}
