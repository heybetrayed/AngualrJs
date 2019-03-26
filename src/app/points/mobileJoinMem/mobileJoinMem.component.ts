import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {SaveMemService} from '../saveMem/saveMem.service';
import {ItrlMemDTO} from '../itrlAdjust/itrlAdjust-dto';

@Component({
    selector: 'app-mobileJoinMem',
    templateUrl: './mobileJoinMem.component.html',
    styleUrls: ['./mobileJoinMem.component.css'],
    providers: [SaveMemService]
})
export class MobilejoinmemComponent implements OnInit {

    @ViewChild('content') content: TemplateRef<any>;
    itrlMemDto: ItrlMemDTO;
    saveForm: FormGroup;
    mr: NgbModalRef;
    result: string;

    constructor(private fb: FormBuilder, private modalService: NgbModal,
                private http: HttpClient, private saveMemService: SaveMemService) {

    }

    ngOnInit() {
        this.saveForm = this.fb.group({
            memNo: [],
            memPhone: [],
        });


    }


    updateMem() {
        this.result = '';
        this.itrlMemDto = this.saveForm.value;
        this.saveMemService.joinMobileByMemResource(this.itrlMemDto).subscribe((response) => this.onSuccess(response), (error) => this.onError(error));
    }

    onSuccess(result) {
        if (result.json > 0) {
            this.result = '成功';
            this.saveForm.setValue({'memNo': '', 'memPhone': ''});
        }
    }

    onError(error) {
        this.result = error._body;
    }


}
