import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DataTableDirective} from 'angular-datatables';


declare var $: any;
declare var jQuery: any;
declare var swal: any;

@Component({
    selector: 'app-sendEmail',
    templateUrl: './sendEmail.component.html',
    styleUrls: ['./sendEmail.component.css'],
})

export class SendEmailComponent implements OnInit {
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    @ViewChild('content') content: TemplateRef<any>;
    dtOptions: DataTables.Settings = {};
    mr: NgbModalRef;
    saveForm: FormGroup;
    searchForm: FormGroup;

    constructor() {
    }

    ngOnInit() {
    }




}
