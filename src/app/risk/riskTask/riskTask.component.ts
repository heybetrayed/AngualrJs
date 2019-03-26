import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzMessageService, NzModalRef, NzModalService, UploadXHRArgs} from 'ng-zorro-antd';
import {RiskTaskService} from './riskTask.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RiskTaskDTO} from '../riskTask/riskTaskDTO';
import {RiskNotificationDTO} from '../riskTask/riskNotificationDTO';
import {DatePipe} from '@angular/common';
import {UEditorComponent} from 'ngx-ueditor';
import {UserDto} from '../../gateway/user/UserDto';
import {RiskReportService} from '../riskReport/riskReport.service';
import {FileItem, FileUploader, ParsedResponseHeaders} from 'ng2-file-upload';
import {UPLOAD_URL} from '../../app.constants';
import {RiskDocumentsDTO} from '../riskDocuments/riskDocumentsDTO';
import {HttpClient, HttpEvent, HttpEventType, HttpRequest, HttpResponse} from '@angular/common/http';


declare var $: any;
declare var swal: any;

@Component({
    selector: 'app-risk-task',
    templateUrl: 'riskTask.component.html',
    styleUrls: ['riskTask.component.css']
})
export class RiskTaskComponent implements OnInit {

    @ViewChild('uEditor') uEditor: UEditorComponent;
    @ViewChild('createTable') createTable: ElementRef;
    //目录集合
    saveTaskForm: FormGroup;
    riskTaskDTO: RiskTaskDTO;
    userDTO = new UserDto();
    searchForm: FormGroup;
    taskForm: FormGroup;
    taskCata: FormGroup;
    taskNotification: FormGroup;

    emails: any;
    names: any;
    pageIndex = 1;
    pageSize = 10;
    total = 1;
    loading = true;
    sortValue = null;
    sortKey = null;
    taskAll: any;
    taskId: any;
    notification: any;
    selectedUser: any = [];

    allChecked = false;
    indeterminate = false;

    disabledButton = true;
    checkedNumber = 0;

    operating = false;
    monitorTypeId = -1;
    reportCatalogs: any;
    users: any = [];
    selectedValue = null;

    constructor(
        private iskTaskService: RiskTaskService,
        private nzMessageService: NzMessageService,
        private fb: FormBuilder,
        private riskTaskService: RiskTaskService,
        private modalService: NzModalService,
        private datePipe: DatePipe,
        private messageService: NzMessageService,
        private riskReportService: RiskReportService,
        private http: HttpClient,
    ) {
        this.searchForm = this.fb.group({
            taskName: '',
            startEndTime: '',
            status: ''
        })
    }


    ngOnInit() {
        this.searchData();
        this.riskTaskService.getAllMonitorType().subscribe((response) => {
            this.reportCatalogs = response.body;
        });

        /*  this.riskTaskService.getAllUser().subscribe((response) =>{
                  this.users = response.body.filter(value => value.id!=3);
             })*/

        this.saveTaskForm = this.fb.group({
            id: ['', []],
            taskName: ['', [Validators.required]],
            startEndTime: ['', [Validators.required]],
            directory: ['', [Validators.required]],
            content: ['', [Validators.required]],
            names: ['', [Validators.required]],
        });

        this.taskForm = this.fb.group({
            id: ['', []],
            taskName: ['', []],
            startEndTime: ['', []],
            monitorTypeId: ['', []],
            content: ['', []],
            createDate: ['', []],
            createBy: ['', []],
        });

        this.taskCata = this.fb.group({
            directory: ['', []],
        })
        this.taskNotification = this.fb.group({
            emails: ['', []],
        })
        /*   this.getTypes();*/


    }

    searchGenderList: string[] = [];


    // 搜索数据
    searchData(reset: boolean = false): void {
        this.riskTaskDTO = this.searchForm.value;
        if (this.searchForm.value.startEndTime != null && this.searchForm.value.startEndTime != '') {
            this.riskTaskDTO.startTime = this.searchForm.value.startEndTime[0];
            this.riskTaskDTO.endTime = this.searchForm.value.startEndTime[1];
        }
        if (reset) {
            this.pageIndex = 1;
        }
        this.loading = true;
        const params = {
            page: this.pageIndex - 1,
            size: this.pageSize,
        };
        if (null !== this.sortKey && null !== this.sortValue) {
            this.sortValue = this.sortValue === 'descend' ? 'desc' : 'asc'
            params['sort'] = this.sortKey + ',' + this.sortValue;
        }
        this.riskTaskService.getAllTask(this.riskTaskDTO, params).subscribe((response: any) => {
            this.loading = false;
            this.total = response.body.recordsTotal;
            this.taskAll = response.body.data;
        });
    }

    // 排序
    sort(sort: { key: string, value: string }): void {
        this.sortKey = sort.key;
        this.sortValue = sort.value;
        this.searchData();
    }

    // 全选
    checkAll(value: boolean): void {
        this.taskAll.forEach(data => data.checked = value);
        this.refreshStatus();
    }

    // checkbox - 刷新
    refreshStatus(): void {
        const allChecked = this.taskAll.every(value => value.checked === true);
        const allUnChecked = this.taskAll.every(value => !value.checked);
        this.allChecked = allChecked;
        this.indeterminate = (!allChecked) && (!allUnChecked);
        this.disabledButton = !this.taskAll.some(value => value.checked);
        this.checkedNumber = this.taskAll.filter(value => value.checked).length;

    }

    resetForm() {
        this.saveTaskForm.patchValue({
            id: '',
            taskName: '',
            startEndTime: '',
            content: '',
            /*   directory:null*/

        })
    }

    clearSearchSet() {
        this.searchForm.reset();
        this.searchData();
    }

    // 删除
    deleteTask(taskId: string): void {
        this.riskTaskService.deleteTask(taskId).subscribe((response) => {
            this.searchData();
        }, (e) => this.nzMessageService.error('删除因素失败!!!,<br />错误消息：' + JSON.stringify(e)));
    }

    enableTask(taskId: string): void {
        this.riskTaskService.enableTask(taskId).subscribe((response) => {
            this.searchData();
        }, (e) => this.nzMessageService.error('恢复因素失败!!!,<br />错误消息：' + JSON.stringify(e)));
    }

    // 生成文档
    exportDocs(taskId) {
        this.riskReportService.createDocx(taskId).subscribe((response) => {
            // this.nzMessageService.success('生成成功!');

            // 编辑
            this.editorFiles(response.body);

            // this.riskReportService.downLoadFile(response.body).subscribe((response) => {
            //         // 编辑
            //
            //
            //         // let blob = new Blob([response], {type: 'application/x-download'});
            //         // let objectUrl = URL.createObjectURL(blob);
            //         // let a = document.createElement('a');
            //         // document.body.appendChild(a); // 此处增加了将创建的添加到body当中
            //         // a.href = objectUrl;
            //         // a.download = fileName;
            //         // a.target = '_blank';
            //         // a.click();
            //         // a.remove();
            //     }, (error) => {
            //         this.errorSwal('错误!请联系管理员:' + error);
            //     }
            // );

        }, (e) => {
            console.log(e);
        })
    }

    // 下载文档
    downloadDocs(taskId) {
        this.riskReportService.createDocx(taskId).subscribe((response) => {
            this.nzMessageService.success('生成成功!');

            // 下载
            let fileName = response.body.taskName + '.doc';
            this.riskReportService.downLoadFile(response.body).subscribe((response) => {
                    let blob = new Blob([response], {type: 'application/x-download'});
                    let objectUrl = URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    document.body.appendChild(a); //此处增加了将创建的添加到body当中
                    a.href = objectUrl;
                    a.download = fileName;
                    a.target = '_blank';
                    a.click();
                    a.remove();
                }, (error) => {
                    this.errorSwal('错误!请联系管理员:' + error);
                }
            );

        }, (e) => {
            console.log(e);
        })
    }


    // 批量删除
    deleteSelected(): void {
        const selData = this.taskAll.filter(value => value.checked);
        const that = this;
        this.modalService.confirm({
            nzTitle: '确定禁用吗?',
            //  nzContent: '<b style="color: red;">删除后的数据不可恢复</b>',
            nzOkText: '确定',
            nzOkType: '危险',
            nzOnOk: () => {
                that.operating = true;
                setTimeout(_ => {
                    that.riskTaskService.deleteTaskAll(selData)
                        .subscribe((response) => {
                                that.searchData();
                                that.taskAll.forEach(value => value.checked = false);
                                that.refreshStatus();
                                that.operating = false;
                            },
                            () => that.nzMessageService.error('禁用失败！'));
                });
            },
            nzCancelText: '取消',
            nzOnCancel: () => {
                that.operating = false;
            },
        });
    }

    // Reload
    operateData(): void {
        const selData = this.taskAll.filter(value => value.checked);
        this.nzMessageService.info(JSON.stringify(selData));
        this.operating = true;
        setTimeout(_ => {
            this.taskAll.forEach(value => value.checked = false);
            this.refreshStatus();
            this.operating = false;
        }, 1000);
    }

    isVisible = false;

    addTask(): void {
        this.users = [];
        this.saveTaskForm.patchValue({
            id: '',
            taskName: '',
            startEndTime: '',
            monitorTypeId: '',
            content: '',
            directory: null,
            names: [],
        });
        this.isVisible = true;
    }

    handleCancel(): void {
        this.isVisible = false;
    }

    updateTaskById(taskId) {
        this.riskTaskService.getRiskNotification(taskId).subscribe((response) => {
            this.notification = response.body;
            this.selectedUser = [];
            this.users = response.body
            this.notification.forEach(user => this.selectedUser.push(user.email + ',' + user.firstName))
            this.riskTaskService.getTaskById(taskId).subscribe((response) => {
                this.saveTaskForm.setValue({
                    'id': response.body.id,
                    'taskName': response.body.taskName,
                    'content': response.body.content,
                    'directory': response.body.monitorTypeId,
                    'startEndTime': [response.body.startTime, response.body.endTime],
                    'names': this.selectedUser
                });
                this.isVisible = true
            })
        })
    }

    saveTask() {
        this.riskTaskDTO = this.saveTaskForm.value;
        this.riskTaskDTO.startTime = this.saveTaskForm.value.startEndTime[0];
        this.riskTaskDTO.endTime = this.saveTaskForm.value.startEndTime[1];
        this.riskTaskDTO.monitorTypeId = this.saveTaskForm.value.directory;
        this.riskTaskDTO.emailAndName = this.saveTaskForm.value.names;
        if (this.saveTaskForm.value.id == null || this.saveTaskForm.value.id == '') {
            this.riskTaskService.createRiskTask(this.riskTaskDTO).subscribe((response) => {
                this.successSwal('保存任务成功');
                this.handleCancel();
                this.searchData();
            }, (error) => {
                this.errorSwal('保存失败！');
            });
        } else {
            this.riskTaskService.updateTask(this.riskTaskDTO).subscribe((response) => {
                this.successSwal('修改任务成功！');
                this.handleCancel();
                this.searchData();
            }) , (error) => {
                this.errorSwal('修改任务失败！')
            }
        }
    }

    isVisibleTask = false;

    findTaskById(taskId) {
        const that = this;
        this.riskTaskService.getTaskById(taskId).subscribe((response) => {
            this.monitorTypeId = response.body.monitorTypeId;
            this.taskForm.setValue({
                'id': response.body.id,
                'taskName': response.body.taskName,
                'content': response.body.content,
                'monitorTypeId': response.body.monitorTypeId,
                'startEndTime': that.datePipe.transform(response.body.startTime, 'yyyy-MM-dd') + '至' + that.datePipe.transform(response.body.endTime, 'yyyy-MM-dd'),
                'createDate': that.datePipe.transform(response.body.createDate, 'yyyy-MM-dd HH:mm:ss'),
                'createBy': response.body.createBy,
            })
            //获取目录名称
            this.riskTaskService.getMonitorTypeName(this.monitorTypeId).subscribe((response) => {
                this.taskCata.setValue({
                    'directory': response.body.name
                })
                this.isVisibleTask = true;
            })
        });
        //获取抄送人
        this.riskTaskService.getRiskNotification(taskId).subscribe((respone) => {

            this.emails = '';
            //获取抄送人姓名
            respone.body.forEach(data => {
                this.emails += data.firstName + '  '
            })
            this.taskNotification.setValue({
                'emails': this.emails
            })
        })
    }

    handleCancelTask() {
        this.isVisibleTask = false;
    }

    successSwal(message): void {
        this.messageService.success(message);
    }

    errorSwal(message): void {
        this.messageService.error(message)
    }

    // 动态获取抄送人
    onSearch(nameFragment) {
        this.userDTO.firstName = nameFragment;
        this.riskTaskService.getSpecifiedUser(this.userDTO).subscribe((response) => {
            this.users = response.body.data.filter(value => value.id != 3);
        })

    }

    @ViewChild('onlyofficeContent') onlyofficeContent: TemplateRef<any>;
    @ViewChild('tplTitle') tplTitle: TemplateRef<{}>;
    @ViewChild('tplFooter') tplFooter: TemplateRef<{}>;
    onlyofficeSrc: string;
    onlyofficeKey: string;
    onlyofficeType: string;
    onlyofficeName: string;
    tplModal: NzModalRef;



    editorFiles(data) {
        this.onlyofficeSrc = data.downloadPath;
        this.onlyofficeType = 'doc';
        this.onlyofficeName = data.taskName + '.doc';
        this.onlyofficeKey = new Date().getTime().toString();
        this.tplModal = this.modalService.create({
            nzWidth: 1200,
            nzTitle: null,
            nzContent: this.onlyofficeContent,
            nzFooter: null,
            nzMaskClosable: true,
            nzClosable: true,
            nzStyle: {top: '10px', padding: '0px'}
        });
    }

    customReq = (item: UploadXHRArgs) => {
        // 构建一个 FormData 对象，用于存储文件或其他参数
        const formData = new FormData();
        // tslint:disable-next-line:no-any
        formData.append('file', item.file as any);

        const req = new HttpRequest('POST', item.action, formData, {
            reportProgress: true,
            withCredentials: true
        });
        // 始终返回一个 `Subscription` 对象，nz-upload 会在适当时机自动取消订阅
        return this.http.request(req).subscribe((event: HttpEvent<{}>) => {
            if (event.type === HttpEventType.UploadProgress) {
                if (event.total > 0) {
                    // tslint:disable-next-line:no-any
                    (event as any).percent = event.loaded / event.total * 100;
                }
                // 处理上传进度条，必须指定 `percent` 属性来表示进度
                item.onProgress(event, item.file);
            } else if (event instanceof HttpResponse) {
                // 处理成功
                item.onSuccess(event.body, item.file, event);

                this.riskTaskService.updateDownloadPath(item.data.toString(), event.body['data']).subscribe((response) => {
                    this.successSwal('保存成功');
                    this.handleCancel();
                    this.searchData();
                }, (error) => {
                    this.errorSwal('保存失败！');
                });
            }
        }, (err) => {
            // 处理失败
            item.onError(err, item.file);
        });
    }
}

