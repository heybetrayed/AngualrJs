import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-riskFileTopicSpace',
    templateUrl: './riskDigitizationTopicSpace.component.html',
    styles:[
        `:host ::ng-deep .loadmore {text-align: center;margin-top: 12px;height: 32px;line-height: 32px;}`
    ]
})

export class RiskDigitizationTopicSpaceComponent implements OnInit{
    index1 = 0;
    index2 = 0;
    index3 = 0;

    tabUrlObj = [
        {tabName:'tableOne',url:'riskapp/api/riskFilesPages?draw=1&start=0&length=5'},
        {tabName:'tableTwo',url:'riskapp/api/riskFilesPages?draw=2&start=2&length=5'},
        {tabName:'tableThree',url:'riskapp/api/riskFilesPages?draw=3&start=3&length=5'},
        {tabName:'tableFour',url:'riskapp/api/riskFilesPages?draw=4&start=4&length=5'},
        {tabName:'tableFive',url:'riskapp/api/riskFilesPages?draw=5&start=5&length=5'},
        {tabName:'tableSix',url:'riskapp/api/riskFilesPages?draw=6&start=6&length=5'},
        {tabName:'tableSeven',url:'riskapp/api/riskFilesPages?draw=7&start=7&length=5'},];

    ngOnInit(){}

}
