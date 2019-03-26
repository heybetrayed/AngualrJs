import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {fileDto} from '../../shared/uploader/fileDto';
import {stringify} from 'querystring';

@Component({
  selector: 'app-uploader-file',
  templateUrl: './uploader-file.component.html',
  styleUrls: ['./uploader-file.component.css']
})
export class UploaderFileComponent implements OnInit {

    @ViewChild('uploaderContent') uploaderContent: TemplateRef<any>;
    mr: NgbModalRef;
    saveForm: FormGroup;
    uploaderFiles: Array<fileDto> = [];

  constructor(
      private fb: FormBuilder,
      private modalService: NgbModal) {

  }

    ngOnInit() {
        this.saveForm = this.fb.group({

        })
    }

    showUploadModal(){
        this.mr = this.modalService.open(this.uploaderContent,{ windowClass: 'modal-size-large', size: 'lg', centered: true })
    }

    showFileInfo(successFiles: fileDto[]) {
        this.uploaderFiles = successFiles;
    }

}
