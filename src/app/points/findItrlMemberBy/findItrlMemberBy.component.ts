import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DataTableDirective} from 'angular-datatables';
import {Router} from '@angular/router';
import {FindItrlMemberByService} from './findItrlMemberBy.service';
import {ItrlMemDTO} from '../itrlAdjust/itrlAdjust-dto';

declare var $: any;
declare var jQuery: any;

@Component({
    selector: 'app-findItrlMemberBy',
    templateUrl: './findItrlMemberBy.component.html'
})
export class FindItrlMemberByComponent implements OnInit {
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    saveForm: FormGroup;
    searchForm: FormGroup;
    result: string;
    itrlMemDto: any = new ItrlMemDTO();

    constructor(private fb: FormBuilder, private modalService: NgbModal, private http: HttpClient, private router: Router,
                private findItrlMemberByService: FindItrlMemberByService) {
        this.searchForm = this.fb.group({
            memNo: ''
        })
    }

    ngOnInit() {

    }

    //查询
    search() {
        this.result='';
        this.itrlMemDto = new ItrlMemDTO();
        this.itrlMemDto.memNo = this.searchForm.value.memNo;
        this.findItrlMemberByService.findItrlMem(this.itrlMemDto).subscribe((response) => this.onPostSuccess(response), (error) => this.onPostError(error))
    }

    //正确返回
    private onPostSuccess(response) {
        this.result = JSON.stringify(response.body);
    }

    //错误返回
    private onPostError(error) {
        this.result = error._body;
    }
}
