import {Component, OnInit, ViewChild} from '@angular/core';
import {DataTableDirective} from 'angular-datatables';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ItrlAdjustService} from './itrlAdjust.service';
import {ItrlMemDTO, TransferDTO, TransferItemDTO} from './itrlAdjust-dto';
import {UserService} from '../../gateway/user/user.service';
import {UserDto} from '../../gateway/user/UserDto';

declare var $: any;
declare var jQuery: any;
declare var swal: any;

@Component({
    selector: 'app-itrlLimit',
    templateUrl: './itrlAdjust.component.html',
    styleUrls: ['./itrlAdjust.component.css']
})
export class ItrlAdjustComponent implements OnInit {

    values: number[] = [102, 115, 130, 137];

    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    saveForm: FormGroup;
    searchForm:FormGroup;
    //客户对象
    itrlMemDTO:ItrlMemDTO;
    //用户信息
    user:any = new UserDto();
    //调整后的对象
    transferDTO: any=TransferDTO;
    transferItemDTO: any=TransferItemDTO;
    transferItemList: any = [];
    constructor(private fb: FormBuilder,
                private modalService: NgbModal,
                private http: HttpClient,
                private itrlAdjustService:ItrlAdjustService,
                private userService:UserService) {
        this.searchForm = this.fb.group({
            memNo: '',
            memPhone: ''
        })
    }

    ngOnInit() {
        //查询用户
        this.userService.getUserLogin().subscribe((response)=>{this.user = response.body});
        this.dateRangePicker();
        //表单验证
        this.saveForm = this.fb.group({
            oldItrlMemStatus: ['', [Validators.required]],
            newItrlMemStatus: ['', [Validators.required]],
            memNo: ['', [Validators.required]],
            transferType: ['', [Validators.required]],
            transferReason: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]]
        });
    }

    //查询
    search() {
        this.itrlMemDTO=this.searchForm.value;
        this.itrlAdjustService.search(this.itrlMemDTO).subscribe((response) => this.onGetSuccess(response), () => this.onGetError());
    }

    dateRangePicker() {
        let picker: any = $('#raiseGainDate');
        let dataRageOption: Object = {
            'timePicker': false,
            'timePicker24Hour': false,
            'drops': 'down',
            'opens': 'left',
            'ranges': {
            },
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

    //保存
    saveDdit() {
        this.transferDTO=this.saveForm.value;
        this.transferDTO.transferAfterDTOS=new Array<TransferItemDTO>();
        for (var a in this.transferItemList){
            this.transferItemDTO=new TransferItemDTO();
            this.transferItemDTO.oldScore=this.transferItemList[a].oldScore;
            this.transferItemDTO.oldScoreStaus=this.transferItemList[a].oldScoreStaus;
            this.transferItemDTO.newScore=this.transferItemList[a].newScore;
            this.transferItemDTO.newScoreStaus=this.transferItemList[a].newScoreStaus;
            this.transferItemDTO.applicatID=this.user.id;
            this.transferItemDTO.applicatName=this.user.login;
            this.transferItemDTO.applyTime=new Date();
            this.transferItemDTO.itrlTypeId=this.transferItemList[a].typeId;
            this.transferDTO.transferAfterDTOS[a]=this.transferItemDTO;
        }
        this.transferDTO.applicatId=this.user.id;
        this.transferDTO.applicatName=this.user.login;
        this.transferDTO.itrlMem=new ItrlMemDTO();
        this.transferDTO.itrlMem.id=this.itrlMemDTO.id;
        //修改
        this.itrlAdjustService.edit(this.transferDTO).subscribe((response) => this.onEditSuccess(response), () => this.onUpdateError());
    }

    //查询成功
    private onGetSuccess(response) {
        this.itrlMemDTO=response.body;
        if (null != this.itrlMemDTO.memTypeRelas) {
            for (var a in this.itrlMemDTO.memTypeRelas) {
                if(null==this.transferItemList[a]){
                    this.transferItemList.push({'id': '','oldScore':'','oldScoreStaus':'','newScore':'','newScoreStaus':'','typeName':'','typeId':''});
                }
                this.transferItemList[a].id=this.itrlMemDTO.memTypeRelas[a].id;
                this.transferItemList[a].oldScore=this.itrlMemDTO.memTypeRelas[a].currentScore;
                this.transferItemList[a].oldScoreStaus=this.itrlMemDTO.memTypeRelas[a].integralStatus;
                this.transferItemList[a].typeName=this.itrlMemDTO.memTypeRelas[a].itrlType.typeName;
                this.transferItemList[a].typeId=this.itrlMemDTO.memTypeRelas[a].itrlType.id;
            }
        }
        this.saveForm.setValue({
            'oldItrlMemStatus': this.itrlMemDTO.memStatus,
            'newItrlMemStatus': '',
            'memNo': this.itrlMemDTO.memNo,
            'transferType': '',
            'transferReason': '',
        });
    }

    //修改成功
    private onEditSuccess(response) {
        swal({
            title: "提交成功",
            type: "success",
            confirmButtonClass: "btn-success",
            confirmButtonText: "确认"
        });
        //重置
        this.saveForm.reset();
        this.searchForm.reset();
        //清空
        this.transferItemList=[{'id': '','oldScore':'','oldScoreStaus':'','newScore':'','newScoreStaus':'','typeName':'','typeId':''}];
        this.search();
    }

    //查询失败
    private onGetError() {
        swal({
            title: "查询失败",
            type: "error",
            confirmButtonClass: "btn-danger",
            confirmButtonText: "确认"
        });
    }

    //修改失败
    private onUpdateError() {
        swal({
            title: "提交失败",
            type: "error",
            confirmButtonClass: "btn-danger",
            confirmButtonText: "确认"
        });
        this.search();
    }
}
