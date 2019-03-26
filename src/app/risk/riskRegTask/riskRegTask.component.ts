import {Component, OnInit, TemplateRef, ViewChild, AfterViewInit} from '@angular/core';
import {RiskRegTaskService} from './riskRegTask.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {RiskRegTaskDTO} from './riskRegTaskDTO';
import {RiskDocumentsDTO} from './riskDocumentsDTO';
import {RiskDocumentsService} from '../riskDocuments/riskDocuments.service';
import {NzMessageService, NzModalRef, NzModalService} from 'ng-zorro-antd';

declare var $: any;
declare var swal: any;

@Component({
    selector: 'app-riskFileTask',
    templateUrl: './riskRegTask.component.html',
    styleUrls: ['./riskRegTask.component.css'],
})
export class RiskRegTaskComponent implements OnInit {

    mr: NgbModalRef;
    taskId: 0;
    searchForm: FormGroup;
    saveTaskForm: FormGroup;
    riskRegTaskDTO: RiskRegTaskDTO;
    riskDocuments: Array<RiskDocumentsDTO>;

    constructor(
        private fb: FormBuilder,
        private riskRegTaskService: RiskRegTaskService,
        private riskDocumentsService: RiskDocumentsService,
        private modalService: NzModalService,
        private nzMessageService: NzMessageService
    ) {
        this.searchForm = this.fb.group({
            rTStartName: ''
        })
    }

    ngOnInit() {
        this.getOrganizations();
        this.searchData();
        /*----------------------------保存表单验证-------------------------*/
        this.saveTaskForm = this.fb.group({
            id: [],
            rTStartDept: ['', [Validators.required]],
            rTStartName: ['', [Validators.required]],
            rTLevel: ['', [Validators.required]],
            startEndTime: ['', [Validators.required]],
            // processId: ['', [Validators.required]],
            status: ['', [Validators.required]],
        });
    }

    /*-------------------------------查询部门-----------------------------*/
    organizations: any;

    getOrganizations() {
        this.riskRegTaskService.getOrganizations().subscribe((response) => {
            this.organizations = response.body;
        }, () => {
            this.nzMessageService.error("获取部门失败!请联系管理员");
        });
    }


    // 搜索数据
    pageIndex = 1;
    pageSize = 10;
    loading = true;
    sortValue = null;
    sortKey = null;
    total = 1;
    regTaskAll: any;

    searchData(reset: boolean = false): void {
        this.riskRegTaskDTO = this.searchForm.value;
        if (reset) {
            this.pageIndex = 1;
        }
        this.loading = true;
        const params = {
            page: this.pageIndex - 1,
            size: this.pageSize,
        };
        if (null !== this.sortKey && null !== this.sortValue) {
            this.sortValue = this.sortValue === 'descend' ? 'desc' : 'asc';
            params['sort'] = this.sortKey + ',' + this.sortValue;
        }
        this.riskRegTaskService.getAllRegTask(this.riskRegTaskDTO, params).subscribe((response: any) => {
            this.loading = false;
            this.total = response.body.recordsTotal;
            this.regTaskAll = response.body.data;
        });
    }

    /*----------------------------显示发送任务窗口-------------------------*/
    isVisible = false;

    showTask(): void {
        this.saveTaskForm.reset();
        this.isVisible = true;
    }

    /*----------------------------退出发送任务窗口-------------------------*/
    handleCancel(): void {
        this.isVisible = false;
    }


    resetSaveTaskForm(){
        this.saveTaskForm.reset();
    }

    onChange(result: Date[]): void {
        // console.log('From: ', result[0], ', to: ', result[1]);
    }


    /*----------------------------显示上传文件窗口-------------------------*/
    @ViewChild('uploaderContent') uploaderContent: TemplateRef<any>;
    uploadeModal: NzModalRef;
    showUploadModal(taskId) {
        this.taskId = taskId;
        this.uploadeModal = this.modalService.create({
            nzWidth: 1200,
            nzTitle: null,
            nzContent: this.uploaderContent,
            nzFooter: null,
            nzMaskClosable: true,
            nzClosable: true,
            nzStyle: {top:'10px',padding:'0px'}
        });
        // this.mr = this.modalService.open(this.uploaderContent, {windowClass: 'modal-size-large', size: 'lg', centered: true})
    }



    fileDtoList: Array<RiskDocumentsDTO> = [];
    showFileInfo(successFiles: RiskDocumentsDTO[]) {
        this.fileDtoList = successFiles;
    }


    fileList = [];

    handleChange(info: any): void {
        const fileList = info.fileList;

        if (info.file.response) {
            info.file.url = info.file.response.url;
            console.log(' info.file.url   ' + info.file.url);
        }
        this.fileList = fileList.filter(item => {
            if (item.response) {

                console.log('item.response   ' + item.response);
                return item.response.status === 'success';
            }
            return true;
        });
    }


    /*----------------------------保存任务-------------------------*/

    saveTask() {
        this.riskRegTaskDTO = this.saveTaskForm.value;
        this.riskRegTaskDTO.rTStartTime = this.saveTaskForm.value.startEndTime[0];
        this.riskRegTaskDTO.rTEndTime = this.saveTaskForm.value.startEndTime[1];
        this.riskRegTaskService.createRiskRegTask(this.riskRegTaskDTO).subscribe((response) => {
            this.nzMessageService.success("保存任务成功");
            this.handleCancel();
            this.searchData();
        }, (error) => {
            this.nzMessageService.error("保存失败");
        });
    }

    /**
     * 保存上传的文件
     */
    saveDocument() {
        this.riskRegTaskDTO.id = this.taskId;
        this.riskRegTaskDTO.documents = this.fileDtoList;
        if(this.fileDtoList.length == 0){
            this.nzMessageService.info("请先上传文件");
        }else{
            this.riskRegTaskService.saveDocumentByTask(this.riskRegTaskDTO).subscribe((response) => {
                this.nzMessageService.success("保存文件成功");
                this.fileDtoList=[];
                this.closeUpload();
                this.searchData();
            }, (error) => {
                this.nzMessageService.error("保存失败");
            });
        }
    }

    /**
     * 关闭上传的文件
     */
    closeUpload(){
        this.fileDtoList=[];
        this.uploadeModal.close();
    }

    isFileUploadVisible = false;

    showUploadFile(taskId): void {
        this.riskDocumentsService.listDocumentsBytaskId(taskId).subscribe((response) => {
            this.riskDocuments = response.body;
            this.isFileUploadVisible = true;
        })
    }

    handleFileUploadCancel(): void {
        this.isFileUploadVisible = false;
    }

    // 查看文件
    @ViewChild('onlyofficeContent') onlyofficeContent: TemplateRef<any>;
    @ViewChild('tplTitle') tplTitle: TemplateRef<{}>;
    @ViewChild('tplFooter') tplFooter: TemplateRef<{}>;
    onlyofficeSrc: string;
    onlyofficeKey: string;
    onlyofficeType: string;
    onlyofficeName: string;
    viewDocModal: NzModalRef;
    viewDoc(item: RiskDocumentsDTO): void {
        const that = this;
        this.onlyofficeSrc = item.docPath;
        this.onlyofficeKey = new Date().getTime().toString();
        this.onlyofficeType = item.docPostfix;
        this.onlyofficeName = item.docName;
        this.viewDocModal = that.modalService.create({
            nzWidth: 1200,
            nzTitle: null,
            nzContent: that.onlyofficeContent,
            nzFooter: null,
            nzMaskClosable: true,
            nzClosable: true,
            nzStyle: {top:'10px',padding:'0px'}
        });
    }



}

