import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {SERVER_API_URL} from '../../app.constants';
import {DataTablesResponse} from '../../shared/data-tables-response';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DataTableDirective} from 'angular-datatables';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {QuartzDTO} from './quartzDTO';
import {QuartzService} from './quartz.service';

declare var $: any;
declare var jQuery: any;
declare var swal: any;

@Component({
    selector: 'app-quartz',
    templateUrl: './quartz.component.html',
    styleUrls: ['./quartz.component.css']
})
export class QuartzComponent implements OnInit {
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    @ViewChild('content') content: TemplateRef<any>;
    dtOptions: DataTables.Settings = {};
    searchForm: FormGroup;
    quartzId: string = '';
    // 标题名称
    titleName: string = '';

    saveForm: FormGroup;

    mr: NgbModalRef;

    quartzDTO: QuartzDTO;

    nameFlag: boolean;
    classFlag: boolean;

    saveUpdate: boolean;

    createDate: Date;
    createBy: string;
    readOnlyFlag: boolean = true;

    constructor(private http: HttpClient, private fb: FormBuilder, private modalService: NgbModal, private quartzService: QuartzService) {
        this.searchForm = this.fb.group({
            jobName: '',
            jobGroup: '',
            jobStatus: '',
            jobClass: ''
        })
    }

    ngOnInit() {

        //表单验证
        this.saveForm = this.fb.group({
            id: [],
            jobName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
            jobGroup: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
            jobStatus: ['', [Validators.required]],
            jobClass: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
            jobCron: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
            jobDesc: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
        });

        const that = this;
        this.dtOptions = {
            searching: false,
            serverSide: true,
            processing: true,
            ordering: false,
            ajax: (dataTablesParameters: any, callback) => {
                that.http.post<DataTablesResponse>(
                    SERVER_API_URL + 'quartz/api/getAllSchedulePage' + '?draw=' + dataTablesParameters.draw + '&start=' + dataTablesParameters.start + '&length=' + dataTablesParameters.length,
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
                title: '任务名称',
                data: 'jobName'
            }, {
                title: '任务所属小组',
                data: 'jobGroup'
            }, {
                title: '任务时间表达式',
                data: 'jobCron'
            }, {
                title: '任务执行类',
                data: 'jobClass'
            },
                {
                    title: '任务状态',
                    data: 'jobStatus',
                    render: function (data, type, row) {
                        if (data == 0) {
                            return '正常运行';
                        } else if (data == 1) {
                            return '停止运行';
                        } else if (data == 2) {
                            return '已删除';
                        } else if (data == 3) {
                            return '运行一次';
                        }
                    },
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

//停止任务
    stopTask(quartzId) {
        this.quartzDTO = new QuartzDTO();
        this.quartzDTO.id = quartzId;
        this.quartzDTO.jobStatus = 1;
        if ('' != quartzId) {
            this.quartzService.getOne(quartzId).subscribe((response) => this.onGetCheckStopStatus(response.body, this.quartzDTO), () => this.onGetError('任务详情'));

        }else{
            this.onSelectOne();
        }
    }

    //启动任务
    startTask(quartzId) {
        this.quartzDTO = new QuartzDTO();
        this.quartzDTO.id = quartzId;
        this.quartzDTO.jobStatus = 0;
        if ('' != quartzId) {
            this.quartzService.getOne(quartzId).subscribe((response) => this.onGetCheckStartStatus(response.body, this.quartzDTO), () => this.onGetError('任务详情'));

        }else{
            this.onSelectOne();
        }
    }

    //删除任务
    delTask(quartzId) {
        this.quartzDTO = new QuartzDTO();
        this.quartzDTO.id = quartzId;
        this.quartzDTO.jobStatus = 2;
        if ('' != quartzId) {
            this.quartzService.delJob(this.quartzDTO).subscribe((response) => this.onUpdateSuccess(response.body, this.saveForm.value.id), () => this.onSaveError());
        }else{
            this.onSelectOne();
        }
    }

    //验证启动状态
    onGetCheckStartStatus(result, quartzDTO) {
        if (result.json.jobStatus == quartzDTO.jobStatus) {
            this.onCheckStatusError('启动');
        } else {
            this.quartzService.recoveryJob(this.quartzDTO).subscribe((response) => this.onUpdateSuccess(response.body, this.saveForm.value.id), () => this.onSaveError());
        }
    }

    //验证停止状态
    onGetCheckStopStatus(result, quartzDTO) {
        if (result.json.jobStatus == quartzDTO.jobStatus) {
            this.onCheckStatusError('停止');
        } else {
            this.quartzService.stopJob(this.quartzDTO).subscribe((response) => this.onUpdateSuccess(response.body, this.saveForm.value.id), () => this.onSaveError());
        }
    }

    //获取任务
    getTask(quartzId) {
        if (quartzId != '') {
            this.quartzService.getOne(quartzId).subscribe((response) => this.onGetTaskSuccess(response.body), () => this.onGetError('任务详情'));
        }else{
            this.onSelectOne();
        }

    }


//立即运行一次
    runOneTask(quartzId) {
        this.quartzDTO = new QuartzDTO();
        this.quartzDTO.id = quartzId;
        if ('' != quartzId) {
            this.quartzService.runOne(this.quartzDTO).subscribe((response) => this.onUpdateSuccess(response.body, this.saveForm.value.id), () => this.onSaveError());
        }else{
            this.onSelectOne();
        }
    }


    //get 获取成功
    private onGetTaskSuccess(result) {
        this.saveForm.setValue({
            'id': result.id,
            'jobName': result.jobName,
            'jobGroup': result.jobGroup,
            'jobClass': result.jobClass,
            'jobCron': result.jobCron,
            'jobStatus': result.jobStatus,
            'jobDesc': result.jobDesc
        });
        this.createDate = result.createDate;
        this.createBy = result.createBy;
        this.saveUpdate=false;
        //弹出窗口
        this.showAddModal(false);
    }

    //添加或者修改任务
    saveQuartz(saveUpdate) {
        this.quartzDTO = this.saveForm.value;
        if (saveUpdate) {
            this.quartzService.saveJob(this.quartzDTO).subscribe((response) => this.onSaveSuccess(response, this.saveForm.value.id), () => this.onSaveError());
        } else {
            this.quartzDTO.createBy = this.createBy;
            this.quartzDTO.createDate = this.createDate;
            this.quartzService.updateJob(this.quartzDTO).subscribe((response) => this.onSaveSuccess(response, this.saveForm.value.id), () => this.onSaveError());
        }
    }

    //get 获取失败
    private onGetError(message) {
        this.errorSwal(message + '获取失败');
    }

    private onCheckStatusError(message) {
        this.errorSwal('当前状态已经是' + message + '状态，不能再次操作');
    }

    //检查任务名称是否唯一
    checkJobName() {
        this.quartzDTO = new QuartzDTO();
        this.quartzDTO.jobName = this.saveForm.value.jobName;
        if (this.quartzDTO.jobName.length >= 1) {
            this.quartzService.checkJob(this.quartzDTO).subscribe((response) => {
                if(null == response.body){
                    this.nameFlag = false;
                }else{
                    this.nameFlag = true;
                }
            }, () => this.onSaveError());
        }
    }

    //检查任务指向类是否唯一
    checkJobCalss() {
        this.quartzDTO = new QuartzDTO();
        this.quartzDTO.jobClass = this.saveForm.value.jobClass;
        if (this.quartzDTO.jobClass.length >= 1) {
            this.quartzService.checkJob(this.quartzDTO).subscribe((response) => {
                if(null == response.body){
                    this.classFlag = false;
                }else{
                    this.classFlag = true;
                }
            }, () => this.onSaveError());
        }
    }

    //弹出新增窗口
    showAddModal(result) {
        this.titleName = '编辑';
        this.readOnlyFlag = true;
        if (result) {
            this.saveUpdate = true;
            this.titleName = '新增';
            this.readOnlyFlag = false;
            //重置
            this.saveForm.reset();
            //赋值
        }

        this.mr = this.modalService.open(this.content, {windowClass: 'modal-size-large'});
    }

//查询
    search() {
        //清空id
        this.quartzId = '';
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.draw();
        });
    }

    //获取绑定事件
    someClick(info: any) {
        this.quartzId = info.id;
    }

    private onSaveError() {
        //关闭modal
        this.mr.dismiss('cancel');
        this.errorSwal('操作失败');
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

    private onUpdateSuccess(result, id) {

        //关闭modal
        //保存成功，刷新表单
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            if (id == '') {
                this.successSwal('操作成功');
            } else {
                this.successSwal('操作成功');
            }
            this.quartzId='';
            dtInstance.ajax.reload();
        });
    }

    private onSaveSuccess(result, id) {

        //关闭modal
        this.mr.dismiss('cancel');
        //保存成功，刷新表单
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            if (id == '') {
                this.successSwal('操作成功');
            } else {
                this.successSwal('操作成功');
            }
            dtInstance.ajax.reload();
            this.quartzDTO=null;
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

    private onSelectOne() {
        this.errorSwal('请先选中一行');
    }


}
