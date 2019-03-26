import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-riskSentMatter',
    templateUrl: './riskSentMatter.component.html'
})
export class RiskSentMatterComponent implements OnInit {

    datas: any = [
        {
            'index': '1',
            'name01': 'risk001',
            'name02': '审核风险报告',
            'name03': '已发',
            'name04': 'joker',
            'name05': '2017-07-24 10:25:30',
            'name06': 'joker'
        },
        {
            'index': '2',
            'name01': 'risk002',
            'name02': '修改风险报告数据',
            'name03': '已发',
            'name04': 'joker',
            'name05': '2017-07-25 10:25:30',
            'name06': 'joker'
        },
        {
            'index': '3',
            'name01': 'risk003',
            'name02': '修改风险报告数据',
            'name03': '已发',
            'name04': 'joker',
            'name05': '2017-07-26 10:25:30',
            'name06': 'joker'
        }
    ];
    searchForm: FormGroup;
    validateForm: FormGroup;

    // 搜索数据
    pageIndex = 1;
    pageSize = 10;
    loading = true;
    sortValue = null;
    sortKey = null;
    total = 1;

    constructor(private fb: FormBuilder,
                private modalService: NgbModal
    ) {
        this.searchForm = this.fb.group({
            dditItemCode: '',
            dditItemName: '',
            startEndTime: '',
            createBy: '',
            itemStatus: ''
        })
    }

    ngOnInit() {
        //保存表单验证
        this.validateForm = this.fb.group({
            id: [],
            dditItemCode: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(15)]],
            dditItemName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(15)]],
            itemStatus: ['', [Validators.required]]
        });

        this.searchData();

    }

    searchData(reset: boolean = false): void {
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

        this.loading = false;
    }

    // 全选
    allChecked = false;
    indeterminate = false;

    checkAll(value: boolean): void {
        this.datas.forEach(data => data.checked = value);
        this.refreshStatus();
    }

    // checkbox - 刷新
    refreshStatus(): void {
        const allChecked = this.datas.every(value => value.checked === true);
        const allUnChecked = this.datas.every(value => !value.checked);
        this.allChecked = allChecked;
        this.indeterminate = (!allChecked) && (!allUnChecked);

    }

}

