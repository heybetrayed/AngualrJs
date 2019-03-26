import {Component, Input, OnInit} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
    selector: 'app-modeler',
    templateUrl: './modeler.component.html',
    styleUrls: ['./modeler.component.css']
})

export class ModelerComponent implements OnInit {

    iframe: SafeResourceUrl;

    @Input() acurl: string;

    constructor(private sanitizer: DomSanitizer) {
    }

    ngOnInit() {
        this.iframe = this.sanitizer.bypassSecurityTrustResourceUrl(this.acurl);
    }

}
