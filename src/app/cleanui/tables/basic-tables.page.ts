import {Component, Injectable, OnInit} from '@angular/core';

declare var $: any;
declare var jQuery: any;

@Component({
    selector: 'cat-page',
    templateUrl: './basic-tables.html'
})

export class TablesBasicTables implements OnInit {

    constructor() {
    }


    ngOnInit() {
        $(function () {

            $('[data-toggle=tooltip]').tooltip();

        });

    }
}

