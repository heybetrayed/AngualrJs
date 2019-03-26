/**
 *  TODO 待定
 */

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FileItem, FileUploader, ParsedResponseHeaders} from 'ng2-file-upload';
import {RiskDocumentsDTO} from '../../risk/riskDocuments/riskDocumentsDTO';
import {UPLOAD_URL} from '../../app.constants';


@Component({
    selector: 'app-uploader',
    templateUrl: './uploader.component.html',
    styleUrls: ['./uploader.component.css']
})
export class UploaderComponent implements OnInit {

    uploaderFiles: Array<RiskDocumentsDTO> = [];

    @Output() successFile = new EventEmitter();

    public uploader: FileUploader = new FileUploader({url: UPLOAD_URL, method: 'POST', autoUpload: false});

    constructor() {
    }

    ngOnInit() {
        this.uploader.onSuccessItem = this.successItem.bind(this);
        this.uploader.onErrorItem = this.errorItem.bind(this);
    }

    successItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
        // 上传文件成功
        if (status == 200) {
            // 上传文件后获取服务器返回的数据
            let fileName = item.file.name;
            this.uploaderFiles.push(new RiskDocumentsDTO(fileName, item.file.size, JSON.parse(response).data, this.getFileFix(fileName)));
        } else {
            // 上传文件后获取服务器返回的数据错误
        }

        this.successFile.emit(this.uploaderFiles);
        console.info(response + ' for ' + item.file.name + ' status ' + status);
    }

    errorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
        // this.uploaderFiles.push(new RiskDocumentsDTO(item.file.name, item.file.size, response, this.getFileFix(item.file.name)));
        // this.successFile.emit(this.uploaderFiles);
        console.info(response + ' for ' + item.file.name + ' status ' + status);
    }

    getFileFix(fileName: string): string {
        return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length);
    }

}
