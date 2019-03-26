import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {RiskDfMatterService} from './riskDfMatter.service';
import {RiskDigitizationDTO} from '../riskDigitization/risk-digitization-dto';

@Component({
    selector: 'app-risk-df-mastter',
    templateUrl: './riskDfMatter.component.html'
})
export class RiskDfMatterComponent implements OnInit {

    searchForm: FormGroup;
    validateForm: FormGroup;

    // 搜索数据
    pageIndex = 1;
    pageSize = 10;
    loading = true;
    sortValue = null;
    sortKey = null;
    total = 1;
    flowStatus = ['保存待发', '已发', '审批中', '已结束'];

    constructor(
        private fb: FormBuilder,
        private riskDfMatterService: RiskDfMatterService
    ) {
        this.searchForm = this.fb.group({
            name: ''
        })
    }

    ngOnInit() {

        this.searchData();

    }

    riskDigitizations: any;
    riskDigitizationDTO: RiskDigitizationDTO;

    searchData(reset: boolean = false): void {
        this.riskDigitizationDTO = this.searchForm.value;
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

        // 获取数据
        this.riskDfMatterService.listAllRiskDfMatter(this.riskDigitizationDTO, params)
            .subscribe((response: any) => {
                this.loading = false;
                this.total = response.body.recordsTotal;
                this.riskDigitizations = response.body.data;
            });
    }

    // 全选
    allChecked = false;
    indeterminate = false;

    checkAll(value: boolean): void {
        this.riskDigitizations.forEach(data => data.checked = value);
        this.refreshStatus();
    }

    // checkbox - 刷新
    refreshStatus(): void {
        const allChecked = this.riskDigitizations.every(value => value.checked === true);
        const allUnChecked = this.riskDigitizations.every(value => !value.checked);
        this.allChecked = allChecked;
        this.indeterminate = (!allChecked) && (!allUnChecked);

    }

}

