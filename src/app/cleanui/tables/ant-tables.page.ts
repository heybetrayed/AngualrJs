import {Component, ElementRef, Injectable, OnInit, ViewChild} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Rx';
import {SERVER_API_URL} from '../../app.constants';
import {NzMessageService} from 'ng-zorro-antd';

@Injectable()
export class RandomUserService {
    randomUserUrl = '/uaa/api/userPages';

    constructor(private http: HttpClient) {
    }

    getUsers(data, req?: any): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_API_URL + '/uaa/api/userPages', {}, {params: data, observe: 'response'});
    }

}

@Component({
    selector: 'ant-table',
    templateUrl: './ant-tables.html',
    styleUrls: ['./ant-tables.css']
})

export class AntTablesPage implements OnInit {
    pageIndex = 1;
    pageSize = 10;
    total = 1;
    dataSet = [];
    loading = true;
    sortValue = null;
    sortKey = null;
    filterGender = [
        {text: 'male', value: 'male'},
        {text: 'female', value: 'female'}
    ];
    searchGenderList: string[] = [];

    allChecked = false;
    indeterminate = false;

    disabledButton = true;
    checkedNumber = 0;

    operating = false;

    @ViewChild('createTable') createTable: ElementRef;

    columnNum = 3;
    tableObj = [];
    showTable:string;


    constructor(
        private randomUserService: RandomUserService,
        private nzMessageService: NzMessageService
    ) {
    }

    // 搜索数据
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
            this.sortValue = this.sortValue === 'descend' ? 'desc' : 'asc'
            params['sort'] = this.sortKey + ',' + this.sortValue;
        }

        console.log(JSON.stringify(params));
        this.randomUserService.getUsers(params)
            .subscribe((response: any) => {
                this.loading = false;
                this.total = response.body.recordsTotal;
                this.dataSet = response.body.data;
            });
    }

    // 过滤筛选
    updateFilter(value: string[]): void {
        this.searchGenderList = value;
        this.searchData(true);
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

    // 删除-取消事件
    // cancel(): void {
    //     this.nzMessageService.info('click cancel');
    // }

    // 删除-同意事件
    // confirm(data): void {
    //
    //     this.nzMessageService.info('click confirm' + JSON.stringify(data));
    // }

    // 删除
    deleteRow(i: string): void {
        const dataSet = this.dataSet.filter(d => d.id !== i);
        this.dataSet = dataSet;
    }

    // Reload
    operateData(): void {
        const selData = this.dataSet.filter(value => value.checked);
        this.nzMessageService.info(JSON.stringify(selData));

        this.operating = true;
        setTimeout(_ => {
            this.dataSet.forEach(value => value.checked = false);
            this.refreshStatus();
            this.operating = false;
        }, 1000);
    }


    setColumn(): void {
        this.columnNum++;

        this.tableObj.forEach((row) => {
           let num = this.columnNum - row.length;
            for (let i = 0; i < num; i++) {
                row.push({cellvalue: ''});
            }
        })

    }

    addRow(): void {
        console.log('tableObj长度:' + this.tableObj.length);
        this.tableObj.push(this.getRow(this.tableObj.length));
    }

    saveTable(): void {
        console.log(JSON.stringify(this.tableObj));
    }

    getRow(rowNum: number): any {
        let rowObj = [];
        for (let i = 0; i < this.columnNum; i++) {
            // let cellvalue = 'column' + rowNum + i;
            rowObj.push({cellvalue: ''});
        }

        return rowObj;
    }

    ngOnInit() {
        this.searchData();

    }
}