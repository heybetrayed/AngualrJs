import {Component, ElementRef, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RiskNewsDTO} from './riskNewsDTO';
import {RiskNewsService} from './riskNews.service';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
@Component({
    selector: 'app-risk-news',
    templateUrl: './riskNews.component.html',
    styleUrls: ['./riskNews.component.css'],
})
export class RiskNewsComponent implements OnInit {

    searchForm: FormGroup;
    riskNewsDTO: RiskNewsDTO;
    allChecked = false;
    indeterminate = false;
    full_source: string;
    //selectedValue = "1";
    config: any = {
        autoClearinitialContent: true,
        wordCount: false,
        serverUrl: '/riskapp/api/config'

    };

    configLook: any = {
        autoClearinitialContent: true,
        wordCount: false,
        readonly:true,
        serverUrl: '/riskapp/api/config'

    };

    constructor(private fb: FormBuilder,
                private el: ElementRef,
                private modalService: NzModalService,
                private nzMessageService: NzMessageService,
                private riskNewsService: RiskNewsService) {
        this.searchForm = this.fb.group({
            nsTitle: '',
           // status: ''
        })
    }

    ngOnInit() {
        this.searchData();
        /*----------------------------保存表单验证-------------------------*/
        this.validateForm = this.fb.group({
            id: [],
           // nsType: ['', [Validators.required]],
            nsTitle: ['', [Validators.required]],
            nsContent: ['', [Validators.required]],
            status: ['', [Validators.required]]
        });
    }

    /*-------------------------------查询-------------------------------------*/

    // 搜索数据
    pageIndex = 1;
    pageSize = 10;
    loading = true;
    sortValue = null;
    sortKey = null;
    riskNews: any;
    total = 1;

    searchData(reset: boolean = false): void {

        this.riskNewsDTO = this.searchForm.value;
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

        console.log(JSON.stringify(params));

        this.riskNewsService.listAllNews(this.riskNewsDTO, params)
            .subscribe((response: any) => {
                this.loading = false;
                this.total = response.body.recordsTotal;
                this.riskNews = response.body.data;
            });
    }

    // 全选
    checkAll(value: boolean): void {
        this.riskNews.forEach(data => data.checked = value);
        this.refreshStatus();
    }

    // checkbox - 刷新
    refreshStatus(): void {
        const allChecked = this.riskNews.every(value => value.checked === true);
        const allUnChecked = this.riskNews.every(value => !value.checked);
        this.allChecked = allChecked;
        this.indeterminate = (!allChecked) && (!allUnChecked);

    }

    isNewsVisible = false;
    isShowNewsVisible   = false;
    addNews() {
        this.validateForm.setValue({
            id: '',
            nsTitle: '',
            nsContent: '',
            //nsType: '',
            status: ''
        });
        this.isNewsVisible = true;
    }

    handleNewsOk(): void {
        this.isNewsVisible = false;

    }

    handleNewsCancel(): void {
        this.isNewsVisible = false;
        this.isShowNewsVisible   = false;
    }

    validateForm: FormGroup;
    submitForm = ($event, value) => {
        $event.preventDefault();
        for (const key in this.validateForm.controls) {
            this.validateForm.controls[key].markAsDirty();
            this.validateForm.controls[key].updateValueAndValidity();
        }
        if (this.validateForm.get('id').value) {
            // 更新
            this.riskNewsService.updateNews(value).subscribe((response) => {
                this.searchData();
                this.nzMessageService.success('操作成功！')
            }, (response) => this.nzMessageService.error('操作失败！：\n' + JSON.stringify(response.error)));
        } else {
            // 新增
            this.riskNewsService.saveNews(value).subscribe((response) => {
                this.searchData();
                this.nzMessageService.success('操作成功！');
            }, (response) => this.nzMessageService.error('操作失败！:\n' + JSON.stringify(response.error)));
        }

    };

    details(data: RiskNewsDTO){
        let status = data.status.toString();
        this.validateForm.setValue({
            id: data.id,
            nsTitle: data.nsTitle,
            nsContent: data.nsContent,
            // nsType: data.nsType,
            status: status
        });

        this.isShowNewsVisible = true;
    }

    editNews(data: RiskNewsDTO) {
        let status = data.status.toString();
        this.validateForm.setValue({
            id: data.id,
            nsTitle: data.nsTitle,
            nsContent: data.nsContent,
           // nsType: data.nsType,
            status: status
        });

        this.isNewsVisible = true;
    }

    getAllHtml() {
        // 通过 `this.full.Instance` 访问ueditor实例对象
        // console.log(this.full.Instance.getAllHtml());
    }


}

