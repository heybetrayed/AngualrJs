import {Component, OnInit} from '@angular/core';
import {CemsdfService} from './cemsdf.service';
import {CemSdfDto} from './cemsdf-dto';

@Component({
    selector: 'app-commonboard',
    templateUrl: 'cemsdf.html'
})
export class CemsdfComponent implements OnInit {

    cemSdfDtos: CemSdfDto[];
    req: any = {};

    constructor(private cemsdfService: CemsdfService) {

    }

    ngOnInit() {
        this.cemsdfService.getCemSdfs({size: 9999}).subscribe(
            response => {
                this.cemSdfDtos = response.body;
            }
        );
    }


}
