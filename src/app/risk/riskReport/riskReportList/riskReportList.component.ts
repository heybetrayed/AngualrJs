import {AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
import {HttpClient} from '@angular/common/http';

@Component({
    selector: 'app-risk-report-List',
    templateUrl: './riskReportList.component.html',
    styleUrls: ['./riskReportList.css']
})
export class RiskReportListComponent implements OnInit, AfterViewInit {
    @Input() fakeDataUrl;
    @Input() tabIndex = 0;
    @Input() nameWidth = '200';

    @ViewChild('aname') aname: ElementRef;

    loading = true; // bug
    loadingMore = false;
    showLoadingMore = true;
    data = [];

    constructor(
        private http: HttpClient,
        private msg: NzMessageService,
    ) {
    }

    ngOnInit(): void {
        this.getData((res: any) => {
            this.data = res.data;
            this.loading = false;
        });

    }

    ngAfterViewInit(): void {
        //this.el.nativeElement.querySelector('.ellipsis').style.width = this.width + 'px';
        //this.renderer2.setStyle(this.aname.nativeElement, 'width', this.width + 'px');
    }

    getData(callback: (res: any) => void): void {
        this.http.post(this.fakeDataUrl, {}).subscribe((res: any) => callback(res));
    }

    onLoadMore(): void {
        this.loadingMore = true;
        this.http.get(this.fakeDataUrl).subscribe((res: any) => {
            this.data = this.data.concat(res.results);
            this.loadingMore = false;
        });
    }

    edit0(item: any): void {
        this.msg.success('0');
    }

    edit1(item: any): void {
        this.msg.success('1');
    }

    edit2(item: any): void {
        this.msg.success('2');
    }

    edit3(item: any): void {
        this.msg.success('3');
    }

    edit4(item: any): void {
        this.msg.success('4');
    }

    edit5(item: any): void {
        this.msg.success('5');
    }

    edit6(item: any): void {
        this.msg.success('6');
    }

}
