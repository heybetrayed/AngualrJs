import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {InjectionNames, Modeler, OriginalPaletteProvider} from './bpmn-js/bpmn-js';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProvider from 'bpmn-js-properties-panel/lib/provider/camunda';
import {CamundaModdleDescriptor} from './modeler/custom-moddle';
import {CustomPaletteProvider} from './props-provider/CustomPaletteProvider';
import {WorkflowService} from './workflow.service';
import {NzMessageService} from 'ng-zorro-antd';
import customTranslate from './translate/CustomTranslate';

const  customTranslateModule = {
    translate: [ 'value', customTranslate ]
};

@Component({
    selector: 'app-workflow',
    templateUrl: './workflow.component.html',
    styleUrls: ['./workflow.component.css']
})
export class WorkflowComponent implements OnInit {
    title = 'Angular/BPMN';
    modeler: any;

    constructor(
        private http: HttpClient,
        private workflowService: WorkflowService,
        private messageService: NzMessageService
    ) {
    }

    ngOnInit(): void {
        this.modeler = new Modeler({
            container: '#canvas',
            width: '100%',
            height: '800px',
            additionalModules: [
                propertiesProvider,
                propertiesPanelModule,
                customTranslateModule,

                // Re-use original bpmn-properties-module, see CustomPropsProvider
                // {[InjectionNames.bpmnPropertiesProvider]: ['type', OriginalPropertiesProvider.propertiesProvider[1]]},
                // {[InjectionNames.propertiesProvider]: ['type', CustomPropsProvider]},

                // Re-use original palette, see CustomPaletteProvider
                {[InjectionNames.originalPaletteProvider]: ['type', OriginalPaletteProvider]},
                {[InjectionNames.paletteProvider]: ['type', CustomPaletteProvider]},

            ],
            propertiesPanel: {
                parent: '#properties'
            },
            moddleExtensions: {
                camunda: CamundaModdleDescriptor
            }
        });

        this.load();
    }

    handleError(err: any) {
        if (err) {
            console.warn('Ups, error: ', err);
        }
    }

    load(): void {
        const url = '/assets/bpmn/initial.bpmn';
        this.http.get(url, {
            headers: {observe: 'response'}, responseType: 'text'
        }).subscribe(
            (x: any) => {
                console.log('Fetched XML, now importing: ', x);
                this.modeler.importXML(x, this.handleError);
            },
            this.handleError
        );
    }

    saveDiagram(): void {
        this.modeler.saveXML((err: any, xml: any) => {
            debugger;
            console.log('Result of saving XML: ', err, xml)
            this.workflowService.sendXML(xml).subscribe((response) => {
                this.messageService.success('保存成功！')
            }, (error) => {
                this.messageService.error('保存失败！');
            })
        });
    }
}
