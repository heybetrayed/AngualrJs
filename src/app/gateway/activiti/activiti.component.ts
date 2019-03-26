import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzMessageService, NzModalRef, NzModalService} from 'ng-zorro-antd';
import {RandomUserService} from '../../cleanui/tables/ant-tables.page';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivitiService} from './activiti.service';
import {ActivitiDto} from './activiti-dto';
import {FASTDFS_API_URL} from '../../app.constants';

@Component({
    selector: 'app-activiti',
    templateUrl: 'activiti.component.html',
    styleUrls: ['activiti.component.css']
})

export class ActivitiComponent implements OnInit {

    pageIndex = 1;
    pageSize = 10;
    total = 1;
    dataSet = [];
    loading = true;
    sortValue = null;
    sortKey = null;
    allChecked = false;
    indeterminate = false;
    disabledButton = true;
    checkedNumber = 0;
    operating = false;
    searchForm: FormGroup;
    validateForm: FormGroup;
    isVisible = false;
    activitiDto: ActivitiDto;
    @ViewChild('activitiContent') activitiContent: TemplateRef<any>;
    iframe: string;

    constructor(
        private fb: FormBuilder,
        private el: ElementRef,
        private randomUserService: RandomUserService,
        private nzMessageService: NzMessageService,
        private activitiService: ActivitiService,
        private modalService: NzModalService
    ) {
        this.searchForm = this.fb.group({
            name: ''
        });

    }


    ngOnInit() {
        this.searchData();
        this.validateForm = this.fb.group({
            name: ['', [Validators.required]],
            key: ['', [Validators.required]],
            description: ['']
        });
    }


    // 搜索数据
    searchData(reset: boolean = false): void {
        this.activitiDto = this.searchForm.value;
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

        this.activitiService.listAllModelsByParams(this.activitiDto, params)
            .subscribe((response: any) => {
                this.loading = false;
                this.total = response.body.recordsTotal;
                this.dataSet = response.body.data;
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
        this.dataSet.forEach(data => data.checked = value);
        this.refreshStatus();
    }

    // checkbox - 刷新
    refreshStatus(): void {
        const allChecked = this.dataSet.every(value => value.checked === true);
        const allUnChecked = this.dataSet.every(value => !value.checked);
        this.allChecked = allChecked;
        this.indeterminate = (!allChecked) && (!allUnChecked);

        this.disabledButton = !this.dataSet.some(value => value.checked);
        this.checkedNumber = this.dataSet.filter(value => value.checked).length;

    }

    showAddModal() {
        this.validateForm.setValue({
            name: '',
            key: '',
            description: ''
        });
        this.isVisible = true;
    }

    handleOk(): void {
        this.isVisible = false;
    }

    handleCancel(): void {
        this.isVisible = false;
    }

    submitForm = ($event, value) => {
        $event.preventDefault();
        this.activitiService.saveModel(value).subscribe((response) => {
            this.searchData();

            // 模板创建成功
            this.iframe = 'activitios/modeler.html?modelId=' + response.body.id;

            this.modalService.create({
                nzTitle: null,
                nzContent: this.activitiContent,
                nzFooter: null,
                nzWidth: 1000,
                nzMaskClosable: true,
                nzClosable: false,
                nzBodyStyle: {padding: '0px'}
            });


        }, (response) => this.nzMessageService.error('操作失败！：\n' + JSON.stringify(response.error)));
    };

    bpmnModal: NzModalRef;

    editor(modeId: string): void {
        // 模板创建成功
        this.iframe = 'activitios/modeler.html?modelId=' + modeId;

        this.bpmnModal = this.modalService.create({
            nzTitle: null,
            nzContent: this.activitiContent,
            nzFooter: null,
            nzWidth: 1000,
            nzMaskClosable: true,
            nzClosable: false,
            nzBodyStyle: {padding: '0px'}
        });
    }

    closeModel(): void {
        this.bpmnModal.close();
    }

    success(msg: string): void {
        this.nzMessageService.success(msg);
    }

    error(msg: string): void {
        this.nzMessageService.error(msg);
    }
}




