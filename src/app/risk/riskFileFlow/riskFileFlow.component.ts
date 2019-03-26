import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {SERVER_API_URL} from '../../app.constants';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import {DataTableDirective} from 'angular-datatables';
import {HttpClient} from '@angular/common/http';
import {RiskFileFlowService} from './riskFileFlow.service';
import {Router} from '@angular/router';
import {RiskFileDTO} from '../riskFile/riskFileDTO';
import {FileUploader} from 'ng2-file-upload';
import {createRequestOption} from '../../core/http/request-util';
import {RiskFileTaskExtensionDTO} from './riskFileTaskExtensionDTO';
import {fileDto} from '../../shared/uploader/fileDto';


declare var $: any;
declare var jQuery: any;
declare var swal: any;

@Component({
    selector: 'app-riskFileFlowTask',
    templateUrl: './riskFileFlow.component.html',
    styleUrls: ['./riskFileFlow.component.css'],
    providers: [RiskFileFlowService]

})
export class RiskFileFlowComponent implements OnInit {
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    @ViewChild('uploaderContent') uploaderContent: TemplateRef<any>;
    @ViewChild('activitiContent') activitiContent: TemplateRef<any>;
    @ViewChild('content') content: TemplateRef<any>;
    mr: NgbModalRef;
    saveForm: FormGroup;
    riskFileDto: RiskFileDTO;
    riskFileTaskExtensionDto: RiskFileTaskExtensionDTO;
    result: string;
    header: any = createRequestOption();
    riskFileList: Array<RiskFileDTO> = [];
    fileDtoList: Array<fileDto> = [];
    fileDto: fileDto;

    public uploader: FileUploader = new FileUploader({
        url: SERVER_API_URL + 'riskapp/api/fileUpload',
        method: 'POST',
        itemAlias: 'file',
        headers: this.header,
        queueLimit: 1,
        removeAfterUpload: true
    });

    constructor(private modalService: NgbModal, private http: HttpClient,
                private fb: FormBuilder, private router: Router,
                private riskFileFlowService: RiskFileFlowService,) {

    }

    ngOnInit() {

        $(function () {

            $('.dropify').dropify();
            $('.dropify-clear').html('删除');
            $('.dropify-infos-message').html('拖放和点击文件');
            //$('.file-icon').children("p:first").html("拖放和点击文件");

        });

        this.dateRangePicker();
        //表单验证
        this.saveForm = this.fb.group({
            riskFiItId: [],
            riskFileId: [],
            riskFileTaskId: [],
            rftName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
            rftReceiver: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(80)]],
            rftEmergencyLev: ['', [Validators.required]],
            startEndTime: ['', [Validators.required]],
        });


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
                that.saveForm.patchValue({
                    startEndTime: ''
                });
                this.startDate = moment().subtract('days', 2).endOf('day');
                this.endDate = moment().startOf('day');
            } else {
                this.element.val(this.startDate.format(this.locale.format) + this.locale.separator + this.endDate.format(this.locale.format));
                that.saveForm.patchValue({
                    startEndTime: this.element.val()
                });
            }

        });

    }


    flag: boolean;

    //任务保存
    saveRiskFileTask() {
        this.fileDtoList.forEach((value, index) => {
            this.riskFileDto = new RiskFileDTO();
            this.riskFileDto.rfName = value.name;
            this.riskFileDto.rfUrl = value.fileUrl;
            this.riskFileList.push(this.riskFileDto);
        });
        this.riskFileTaskExtensionDto = this.saveForm.value;
        this.riskFileTaskExtensionDto.riskFileDTOList = this.riskFileList;
        this.riskFileFlowService.createRiskFileTaskExtensionDTO(this.riskFileTaskExtensionDto).subscribe((response) => this.saveriskFileTaskSucccess(response), (error) => this.onError(error));

    }

    saveriskFileTaskSucccess(response) {
        this.successSwal('成功');
        this.saveForm.reset();
        this.router.navigate(['/risk/riskFile']);
    }

    onSuccess(reuslt) {
        this.result = '成功';

    }

    onError(error) {
        this.result = error._body;
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


    showUploadModal() {
        this.mr = this.modalService.open(this.uploaderContent, {windowClass: 'modal-size-large', size: 'lg', centered: true})
    }

    showFileInfo(successFiles: fileDto[]) {
        this.fileDtoList = successFiles;
    }

}

