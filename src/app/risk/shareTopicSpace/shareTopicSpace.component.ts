import {AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
import {HttpClient} from '@angular/common/http';

@Component({
    selector: 'app-share-topic-space',
    templateUrl: './shareTopicSpace.component.html',
    styleUrls: ['./shareTopicSpace.css']
})
export class ShareTopicSpaceComponent implements OnInit, AfterViewInit {
    @Input() fakeDataUrl;
    @Input() tabIndex = 0;
    @Input() nameWidth = '200';

    loading = true; // bug
    loadingMore = false;
    showLoadingMore = true;
    data = [];
    isVisible = false;
    showData = {
        id: '',
        title: '',
        type: '',
        createDate: '',
        source: null,
        content: ''
    };

    constructor(
        private http: HttpClient,
        private msg: NzMessageService,
        private el: ElementRef,
        private renderer2: Renderer2
    ) {
    }

    ngOnInit(): void {
        this.getData((res: any) => {
            this.data = res;
            this.loading = false;
        });

    }

    ngAfterViewInit(): void {

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

    showContent(item: any): void {
        this.showData = item;
        this.isVisible = true;
    }

    handleOk(): void {
        this.isVisible = false;
    }

    handleCancel(): void {
        this.isVisible = false;
    }

}
