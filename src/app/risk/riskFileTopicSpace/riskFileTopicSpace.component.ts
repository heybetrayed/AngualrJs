import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-riskFileTopicSpace',
    templateUrl: './riskFileTopicSpace.component.html',
    styles: [
            `:host ::ng-deep .loadmore {
            text-align: center;
            margin-top: 12px;
            height: 32px;
            line-height: 32px;
        }`
    ]
})

export class RiskFileTopicSpaceComponent implements OnInit {
    index1 = 0;
    index2 = 0;
    index3 = 0;

    tabUrlObj = [
        {tabName: 'tableOne', url: 'riskapp/api/listGWFB?size=5'},
        {tabName: 'tableTwo', url: 'riskapp/api/listZZZD?size=5'},
        {tabName: 'tableThree', url: 'riskapp/api/listDWXW?size=5'}];

    ngOnInit() {
    }


    
}
