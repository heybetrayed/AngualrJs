import {Component, Input, OnChanges, OnInit, Renderer2, SimpleChanges} from '@angular/core';
import '../../../assets/modules/weboffice/js/onlyoffice-api.js';
import {FASTDFS_API_URL, WEBOFFICE_API_URL} from '../../app.constants';

declare var DocsAPI: any;

@Component({
    selector: 'app-weboffice',
    templateUrl: './weboffice.component.html',
    styleUrls: ['./weboffice.component.css']
})
export class WebofficeComponent implements OnInit, OnChanges {

    @Input() id: string;
    @Input() onlyofficeSrc: string;
    @Input() onlyofficeName: string;
    @Input() onlyofficeType: string;
    @Input() onlyofficeKey: string;
    @Input() canEditor: string;


    editorConfig: any;
    docEditor: any;

    constructor(private renderer: Renderer2) {

    }

    ngOnInit() {

    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['onlyofficeSrc'] && changes['onlyofficeSrc'].currentValue) {
            this.editorConfig = {
                documentType: this.getDocumentType(this.onlyofficeType),
                url: WEBOFFICE_API_URL,
                width: '100%',
                height: '800px',
                document: {
                    fileType: this.fileType(this.onlyofficeType),
                    key: this.onlyofficeKey,
                    title: this.onlyofficeName,
                    url: FASTDFS_API_URL + this.onlyofficeSrc,
                    permissions: {
                        comment: false,
                        download: true,
                        edit: this.canEditor == null ? false : true,
                        print: false,
                        review: false
                    }
                },
                editorConfig: {
                    'mode': this.canEditor == null ? 'view' : this.canEditor,
                },
                events: {
                    onDocumentStateChange: this.onDocumentStateChange
                }
            };
            this.docEditor = new DocsAPI.DocEditor('placeholder', this.editorConfig);
        }
    }

    onDocumentStateChange(event: any) {
        if (event.data) {
            console.log('The document changed');
        } else {
            console.log('Changes are collected on document editing service');
        }
    }


    private getDocumentType(onlyofficeType: string) {
        switch (onlyofficeType) {
            case 'xlsx':
            case 'xls':
            case 'ods':
                return 'spreadsheet';
            case 'docx':
            case 'doc':
            case 'odt':
            case 'txt':
                return 'text';
            case 'pptx':
            case 'ppt':
            case 'odp':
                return 'presentation';
            default:
                return 'text';
        }
    }

    private fileType(onlyofficeType: string) {
        switch (onlyofficeType) {
            case 'xlsx':
            case 'xls':
            case 'ods':
            case 'docx':
            case 'doc':
            case 'odt':
            case 'pptx':
            case 'ppt':
            case 'odp':
                return onlyofficeType;
            default:
                return 'txt';
        }
    }
}
