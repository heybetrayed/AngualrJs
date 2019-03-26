import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {SaveMemService} from './saveMem.service';
import {FileUploader} from 'ng2-file-upload';
import {SERVER_API_URL} from '../../app.constants';
import {createRequestOption} from '../../core/http/request-util';
import {ItrlMemDTO} from '../itrlAdjust/itrlAdjust-dto';

declare var $: any;
declare var jQuery: any;
declare var swal: any;

@Component({
    selector: 'app-saveMem',
    templateUrl: './saveMem.component.html',
    styleUrls: ['./saveMem.component.css']
})
export class SaveMemComponent implements OnInit {
    @ViewChild('content') content: TemplateRef<any>;
    itrlMemDto: ItrlMemDTO;
    saveForm: FormGroup;
    mr: NgbModalRef;
    result: string;
    document: Document;
    header: any = createRequestOption();
    fileList: any = [];
    url: string = SERVER_API_URL + 'integralapp/api/bathSaveMem';

    public uploader: FileUploader = new FileUploader({
        url: SERVER_API_URL + 'integralapp/api/bathSaveMem',
        method: 'POST',
        itemAlias: 'file',
        headers: this.header,
        queueLimit:1,
        removeAfterUpload: true
    });

    constructor(private fb: FormBuilder, private modalService: NgbModal,
                private http: HttpClient, private saveMemService: SaveMemService) {
    }


    uploadFileList(event) {
        console.log(event.target.value);
        this.fileList[0] = event.target.value;
    }


    ngOnInit() {

        $(function () {
            $('.dropify').dropify();
        });
        this.saveForm = this.fb.group({
            memNo: [],
            memName: [],
            memAccountType: [],
            memPhone: []
        });

    }


    submitUpload() {
        let formData = new FormData();
        if (this.fileList.length > 0) {
            let file: File = this.fileList;
            formData = new FormData(this.fileList);
            formData.append('file', file, file.name);


        } else {
            this.errorSwal('请选择上传文件');
        }

        $.ajax({
            url: SERVER_API_URL + 'integralapp/api/bathSaveMem',
            type: 'POST',
            data: formData,
            enctype: 'multipart/form-data',
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            xhrFields: {withCredentials: true},
            crossDomain: true,
            success: function (data) {
                alert('上传成功');
            },
            error: function () {
                alert('上传失败');
            }
        });

    }

    selectedFileOnChanged(event: any) {
        console.log(event.target.value);
        this.fileList[0] = event.target.value;
    }


    uploadFile() {
        const that = this;
        if (null != this.fileList[0]) {
            this.uploader.queue[0].upload();
            this.uploader.onErrorItem = function (item, response, status, headers) {
                that.errorSwal('上传失败(' + response.substring(response.indexOf('errorKey') + 13, response.indexOf('type') - 7) + ')');
            };
            this.uploader.onSuccessItem = function (item, response, status, headers) {
                that.successSwal('上传成功');
            };
        } else {
            this.errorSwal('请选择上传文件');
        }
    }


    saveMem() {
        this.result = '';
        this.itrlMemDto = this.saveForm.value;
        this.saveMemService.create(this.itrlMemDto).subscribe((response) => this.onSuccess(response), (error) => this.onError(error));
    }

    onSuccess(reuslt) {
        this.result = '成功';
        this.saveForm.setValue({'memNo': '', 'memName': '', 'memAccountType': '', 'memPhone': ''});

    }

    onError(error) {
        this.result = error._body;
    }

    //错误提示
    private errorSwal(message) {
        swal({
            title: message,
            type: 'error',
            confirmButtonClass: 'btn-danger',
            confirmButtonText: '确认'
        });
    }

    //正确提示
    private successSwal(message) {
        swal({
            title: message,
            type: 'success',
            confirmButtonClass: 'btn-success',
            confirmButtonText: '确认'
        });
    }


}
