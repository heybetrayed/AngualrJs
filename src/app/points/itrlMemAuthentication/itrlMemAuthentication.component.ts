import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ItrlMemAuthenticationService} from './itrlMemAuthentication.service';

@Component({
    selector: 'app-itrlMemAuthentication',
    templateUrl: './itrlMemAuthentication.component.html',
    styleUrls: ['./itrlMemAuthentication.component.css']
})
export class ItrlMemAuthenticationComponent implements OnInit {

    @ViewChild('content') content: TemplateRef<any>;
    saveForm: FormGroup;
    mr: NgbModalRef;
    memberNo: string;
    result: string;

    constructor(private fb: FormBuilder, private modalService: NgbModal,
                private http: HttpClient, private itrlMemAuthenticationService: ItrlMemAuthenticationService) {
    }

    ngOnInit() {
        this.saveForm = this.fb.group({
            memberNo: []
        });
    }

    itrlMemAuthentication() {
        this.result = '';
        this.memberNo = this.saveForm.value.memberNo;
        this.itrlMemAuthenticationService.itrlMemAuthentication(this.memberNo).subscribe((response) => this.onSuccess(response), (error) => this.onError(error));
    }


    onSuccess(reuslt) {
        this.result = '成功!';
        this.saveForm.setValue({'memberNo': ''});

    }

    onError(error) {
        this.result = error._body;
    }


}
