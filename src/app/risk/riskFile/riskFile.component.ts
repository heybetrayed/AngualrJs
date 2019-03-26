import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FASTDFS_API_URL} from '../../app.constants';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {DataTableDirective} from 'angular-datatables';
import {HttpClient} from '@angular/common/http';
import {RiskFileService} from './riskFile.service';
import {RiskFileDTO} from './riskFileDTO';

import {Router} from '@angular/router';
import {RiskFileFlowService} from '../riskFileFlow/riskFileFlow.service';

declare var $: any;
declare var swal: any;

@Component({
    selector: 'app-riskFileTask',
    templateUrl: './riskFile.component.html',
    styleUrls: ['./riskFile.component.css'],
    providers: [RiskFileService]
})
export class RiskFileComponent implements OnInit {
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    @ViewChild('content') content: TemplateRef<any>;
    @ViewChild('onlyofficeContent') onlyofficeContent: TemplateRef<any>;
    mr: NgbModalRef;
    searchForm: FormGroup;
    dtOptions: DataTables.Settings = {};
    onlyofficeSrc: string;
    onlyofficeKey: string;
    onlyofficeType: string;
    onlyofficeName: string;

    allChecked = false;
    indeterminate = false;

    riskFileDto: RiskFileDTO = new RiskFileDTO();

    constructor(private http: HttpClient,
                private fb: FormBuilder,
                private router: Router,
                private riskFileFlowService: RiskFileFlowService,
                private riskFileService: RiskFileService,
                private modalService: NgbModal) {
        this.searchForm = this.fb.group({
            rfName: '',
            departmentId: ''
        });
    }

    pageIndex = 1;
    pageSize = 10;
    total = 1;
    dataSet = [];
    loading = true;
    sortKey = null;
    sortValue = null;

    isVisible = false;
    isOkLoading = false;

    /**
     *  showModal() 显示弹窗
     */
    showModal(): void {
        this.isVisible = true;
    }

    handleOk(): void {
        this.isOkLoading = true;
        window.setTimeout(() => {
            this.isVisible = false;
            this.isOkLoading = false;
        }, 3000);
    }

    handleCancel(): void {
        this.isVisible = false;
    }

    sort(sort: { key: string, value: string }): void {
        this.sortKey = sort.key;
        this.sortValue = sort.value;
        this.searchData();
    }

    searchData(reset: boolean = false): void {
        if (reset) {
            this.pageIndex = 1;
        }
        this.loading = true;

        const params = {
            page: this.pageIndex - 1,
            size: this.pageSize
        };

        this.riskFileService.getAllFiles(params).subscribe((response: any) => {
            this.loading = false;
            this.total = response.body.recordsTotal;
            this.dataSet = response.body.data;
        });
    }

    refreshStatus(): void {
        const allChecked = this.dataSet.every(value => value.checked === true);
        const allUnChecked = this.dataSet.every(value => !value.checked);
        this.allChecked = allChecked;
        this.indeterminate = (!allChecked) && (!allUnChecked);
    }

    ngOnInit(): void {
        this.searchData();
    }

    checkAll(value: boolean): void {
        this.dataSet.forEach(data => data.checked = value);
        this.refreshStatus();
    }

    riskFileFlow() {
        this.router.navigate(['/risk/riskFileFlow']);
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

    showUploadModal(id) {
        const that = this;
        if (id == '' || null == id) {
            this.errorSwal('请选中数据！');
            return;
        }
        this.riskFileDto.id = id;
        this.riskFileDto.findAndDownType = '1';
        this.riskFileService.getRiskFileById(this.riskFileDto).subscribe((response) => {
            this.riskFileDto = response.body;
            this.onlyofficeSrc = FASTDFS_API_URL + this.riskFileDto.rfUrl;
            this.onlyofficeType = this.riskFileDto.rfName.split('.')[1];
            this.onlyofficeName = this.riskFileDto.rfName;
            this.onlyofficeKey = new Date().getTime().toString();
            that.mr = that.modalService.open(that.onlyofficeContent, {windowClass: 'modal-size-large', size: 'lg', centered: true})
        }, (error) => this.errorSwal('查询数据错误'));
        // this.updateRiskFindCount();
    }

}

