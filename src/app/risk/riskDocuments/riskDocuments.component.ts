import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {RiskDocumentsDTO} from './riskDocumentsDTO';
import {RiskDocumentsService} from './riskDocuments.service';
import {NzModalRef, NzModalService} from 'ng-zorro-antd';

declare var $: any;
declare var swal: any;

@Component({
    selector: 'app-riskFileTask',
    templateUrl: './riskDocuments.component.html',
    styleUrls: ['./riskDocuments.component.css'],
})
export class RiskDocumentsComponent implements OnInit {

    mr: NgbModalRef;
    searchForm: FormGroup;
    saveTaskForm: FormGroup;
    riskDocumentsDTO: RiskDocumentsDTO;
    tplModal: NzModalRef;

    constructor(private fb: FormBuilder,
                private modalService: NzModalService,
                private riskDocumentsService: RiskDocumentsService) {
        this.searchForm = this.fb.group({
            docName: ''
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
            processId: ['', [Validators.required]],
            status: ['', [Validators.required]],
        });
    }

    /*-------------------------------查询部门-----------------------------*/
    organizations: any;
    getOrganizations() {
        this.riskDocumentsService.getOrganizations().subscribe((response) => {
            this.organizations = response.body;
        }, () => {
            this.errorSwal('获取部门失败');
        });
    }

    /*-------------------------------查询-------------------------------------*/

    // 搜索数据
    pageIndex = 1;
    pageSize = 10;
    loading = true;
    sortValue = null;
    sortKey = null;
    regTaskAll: any;
    total = 1;

    searchData(reset: boolean = false): void {
        this.riskDocumentsDTO = this.searchForm.value;
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
        this.riskDocumentsService.getAllDocuments(this.riskDocumentsDTO, params)
            .subscribe((response: any) => {
                this.loading = false;
                this.total = response.body.recordsTotal;
                this.regTaskAll = response.body.data;
            });
    }

    @ViewChild('onlyofficeContent') onlyofficeContent: TemplateRef<any>;
    @ViewChild('tplTitle') tplTitle: TemplateRef<{}>;
    @ViewChild('tplFooter') tplFooter: TemplateRef<{}>;
    onlyofficeSrc: string;
    onlyofficeKey: string;
    onlyofficeType: string;
    onlyofficeName: string;

    viewFiles(data) {
        this.riskDocumentsDTO = data;
        const that = this;
        if (data.id == '' || null == data.id) {
            this.errorSwal('请选中数据！');
            return false;
        }
        //根据ID 查询文档信息
        this.riskDocumentsService.getDocumentsById(data.id).subscribe((response) => {
            this.riskDocumentsDTO = response.body;
            this.onlyofficeSrc = this.riskDocumentsDTO.docPath;
            this.onlyofficeType = response.body.docPostfix;
            this.onlyofficeName = response.body.docName;
            this.onlyofficeKey = new Date().getTime().toString();
            that.tplModal = that.modalService.create({
                nzWidth: 1200,
                nzTitle: null,
                nzContent: that.onlyofficeContent,
                nzFooter: null,
                nzMaskClosable: true,
                nzClosable: true,
                nzStyle: {top:'10px',padding:'0px'}
            });
            //点击查看弹出窗口后 更新查看次数
            that.tplModal.afterOpen.subscribe(() => {
                this.riskDocumentsService.updateViewCount( this.riskDocumentsDTO).subscribe((response) => {
                    this.searchData();
                });
            });
        }, (error) => this.errorSwal('查询数据错误'));
    }

    downloadFile(data) {
        this.riskDocumentsDTO = data;
        this.riskDocumentsService.getDocumentsById(data.id).subscribe((response) => {
            let fileName = response.body.docName;
            this.riskDocumentsService.downLoadFile(response.body).subscribe((response) => {
                    let blob = new Blob([response], {type: 'application/x-download'});
                    let objectUrl = URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    document.body.appendChild(a); //此处增加了将创建的添加到body当中
                    a.href = objectUrl;
                    a.download = fileName;
                    a.target = '_blank';
                    a.click();
                    a.remove(); //将a标签移除

                  //点击下载后 更新下载次数
                    this.riskDocumentsService.updateDownLoadCount( this.riskDocumentsDTO).subscribe((response) => {
                        this.searchData();
                    });

                }, (error) => {
                    this.errorSwal('错误!请联系管理员');
                }
            );
        }, (error) => {
            this.errorSwal('查询数据错误')
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


}

