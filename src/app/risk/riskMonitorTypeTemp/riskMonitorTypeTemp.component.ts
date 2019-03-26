import {Component, OnInit} from '@angular/core';
import {NzFormatEmitEvent, NzMessageService, NzTreeNode, NzTreeNodeOptions, TransferChange} from 'ng-zorro-antd';
import {RiskMonitorTypeTempService} from './riskMonitorTypeTemp.service';
import {RiskMonitorTypeTempDTO} from './riskMonitorTypeTempDTO';

@Component({
    selector: 'app-riskMonitorTypeTemp',
    templateUrl: './riskMonitorTypeTemp.component.html',
    styleUrls: ['./riskMonitorTypeTemp.component.css'],
})
export class RiskMonitorTypeTempComponent implements OnInit {

    selectedValue = null;
    list = [];
    monitorTypes: any;
    trees: any;
    monitorTypeId: any;
    riskMonitorTypeTempDTO: RiskMonitorTypeTempDTO;
    showTemp:boolean = false;

    constructor(
        private msg: NzMessageService,
        private riskMonitorTypeTempService: RiskMonitorTypeTempService) {
    }

    ngOnInit() {
        /*----------------------------查询报告框架-------------------------*/
        this.riskMonitorTypeTempService.getAllMonitorTypes().subscribe((response) => {
            this.monitorTypes = response.body;
        });
    };


    getTree(value) {
        this.riskMonitorTypeTempService.getMonitorTypesDetailsById(value).subscribe((response) => {
            this.trees = response.body;
        });
    }

    nzEvent(event: NzFormatEmitEvent): void {
        this.showTemp = false;
        //查询表模板
        this.riskMonitorTypeTempService.getTableTemp(event.node.key).subscribe((response) => {
            this.monitorTypeId = event.node.key;
            this.list = response.body;
        });

        if(event.node.children.length == 0){
            this.showTemp = true;
        }
    }

    reload(direction: string): void {
        this.msg.success(`your clicked ${direction}!`);
    }

    select(ret: {}): void {
        console.log('nzChange', ret);
    }

    change(ret: TransferChange): void {
        let fromto = 'right';
        if (ret.from === 'right') {
            fromto = 'left'
        }
        ret.list.forEach(selectNode => {
            this.list.forEach(node => {
                if (selectNode.key === node.key) {
                    node.direction = fromto
                }
            });
        })
    }

    saveList = [];
    saveAllSelectTableTemp() {
        this.saveList = [];
        this.list.forEach(left => {
            if (left.direction === 'left') {
                this.riskMonitorTypeTempDTO = new RiskMonitorTypeTempDTO;
                this.riskMonitorTypeTempDTO.monitorTypeId = this.monitorTypeId;
                this.riskMonitorTypeTempDTO.tableTempId = left.key;
                this.saveList.push(this.riskMonitorTypeTempDTO);
            }
        });
        //如果save有值 就保存   如果没有  就根据typeId 删除
        if(this.saveList.length>0){
            this.riskMonitorTypeTempService.saveAllSelectTableTemp(this.saveList).subscribe((response) => {
                this.msg.success('保存成功！');
            });
        }else{
            this.riskMonitorTypeTempService.deleteAllSelectTableTemp(this.monitorTypeId).subscribe((response) => {
                this.msg.success('保存成功！');
            });
        }
    }
}