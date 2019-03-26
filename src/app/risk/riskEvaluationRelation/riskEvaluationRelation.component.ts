import {Component, OnInit} from '@angular/core';
import {RiskEvaluationRelationService} from './riskEvaluationRelation.service';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
    selector: 'app-evaluation-relation',
    templateUrl: './riskEvaluationRelation.component.html',
    styleUrls: ['./riskEvaluationRelation.component.css'],
})
export class RiskEvaluationRelationComponent implements OnInit {

    constructor(
        private riskEvaluationRelationService: RiskEvaluationRelationService,
        private fb: FormBuilder,
    ) {
        this.searchForm = this.fb.group({
            aFTitle: ''
        });
    }

    factorSet = [];
    typeSet = [];
    moduleSet = [];

    /*
        the data is stored as following format
        {
            moduleId1:{
                typeId1:[factorId1,factorId2,factorId3...],
                typeId2:[factorId1,factorId2,factorId3...],
                ...
            }
            moduleId2:{
                typeId1:[factorId1,factorId2,factorId3...],
                typeId2:[factorId1,factorId2,factorId3...],
                ...
            }
            ...
        }
        different modules may contain the same types
     */

    dataSet: any;

    showDataSet =
        {
            id: null,
            types: []
        };

    ngOnInit() {
        this.initTemplateSet();
        this.initFactorSet();
        this.initModuleSet();
        this.initTypeSet();

    }

    initFactorSet() {
        this.riskEvaluationRelationService.getFactors({}, {})
            .subscribe((response) => {
                    let factors = response.body.data;
                    this.factorSet = factors;
                },
                () => alert('无法加载因素信息'))
    }

    initTypeSet() {
        this.riskEvaluationRelationService.getTypes({}, {})
            .subscribe((response) => {
                    let types = response.body.data;
                    this.typeSet = types;
                },
                () => alert('无法加载类型信息'))
    }

    initModuleSet() {
        this.riskEvaluationRelationService.getModule({}, {})
            .subscribe((response) => {
                    let modules = response.body.data;
                    this.moduleSet = modules;
                },
                () => alert('无法加载模块信息'))
    }

    /*--------------- 选择模版 -----------------*/
    selectTemplate = null;
    templateSet = [];

    initTemplateSet() {
        this.riskEvaluationRelationService.getTemplate({}, {})
            .subscribe((response) => {
                    let templates = response.body.data;
                    this.templateSet = templates;
                },
                () => alert('无法获取模版信息'))
    }

    //选择模版时加载该模版内容
    getAllRelations() {
        this.riskEvaluationRelationService.getRelation(this.selectTemplate.id)
            .subscribe((response) => {
                this.dataSet = response.body.modules;
                this.dataSet.forEach((module) => {
                    module.types.forEach((type) => {
                        type.expand = true;
                        type.factors.forEach( (factor) => {
                            factor.expand = false;
                        })
                    })
                });
                if(this.dataSet.length == 0){
                    this.showDataSet = {id: null,
                        types: []};
                }
                else {
                    this.showDataSet = this.dataSet[0];
                }
                console.log(this.showDataSet);
                this.initCheckOptionOne();
            });
    }


    /*--------------- 添加模块标签 --------------*/

    closeTab(module: any): void {
        module.types = [];
        module.checked = false;
        this.checkOptionsOne.push(module);
        this.dataSet.splice(this.dataSet.indexOf(module), 1);
    }

    newTab(): void {
        // this.tabs.push('New Tab');
        this.visible = true;
    }

    /*--------------- 添加模块抽屉 ---------------*/
    allChecked = false;
    indeterminate = true;
    visible = false;
    checkOptionsOne = [];

    initCheckOptionOne() {
        this.checkOptionsOne = [];
        this.moduleSet.forEach((module) => {
            let contains = false;
            this.dataSet.forEach((haveModule) => {
                if (module.id == haveModule.id) {
                    contains = true;
                }
            });
            if (!contains) {
                module.types = [];
                module.checked = false;
                this.checkOptionsOne.push(module);
            }
        })
    }

    open(): void {
        this.visible = true;
    }

    close(): void {
        this.visible = false;
    }

    updateAllChecked(): void {
        this.indeterminate = false;
        if (this.allChecked) {
            this.checkOptionsOne.forEach(item => item.checked = true);
        } else {
            this.checkOptionsOne.forEach(item => item.checked = false);
        }
    }

    addModule() {
        let index = 0;
        while (index < this.checkOptionsOne.length) {
            if (this.checkOptionsOne[index].checked == true) {
                this.dataSet.push(this.checkOptionsOne[index]);
                if(this.showDataSet.id == null) {
                    this.showDataSet = this.checkOptionsOne[index];
                }
                this.checkOptionsOne.splice(index, 1);
            }
            else {
                index++;
            }
        }
        this.visible = false;
    }

    // 通过标签修改显示模块
    changeDataSetByModule(module) {
        const that = this;
        this.showDataSet = {id: -1, types:[]};
        this.dataSet.forEach((data) => {
            if (Number(data.id) == Number(module.id)) {
                that.showDataSet = data;
                return;
            }
        });
    }

    /*------------  选择因素，类型模版----------------*/
    factorVisible = false;
    childrenVisible = false;

    addType: any;
    AvailableFactors = [];

    factorOpen(): void {
        this.addType = null;
        this.factorVisible = true;
    }

    factorClose(): void {
        this.factorVisible = false;
    }

    closeChildren(): void {
        this.childrenVisible = false;
    }

    chosenAddType(data) {
        this.addType = data;
        this.showDataSet.types.forEach((type) => {
            if (type.id == data.id) {
                this.addType = type;
                if(!this.addType.hasOwnProperty('factors')) {
                    this.addType.factors = [];
                }
                return;
            }
        });
        this.chosenAddFactor();
        this.childrenVisible = true;
    }

    chosenAddFactor() {
        this.AvailableFactors = [];
        this.factorSet.forEach((factor) => {
            let contains = false;
            this.showDataSet.types.forEach((type) => {
                type.factors.forEach((f) => {
                    if(f.id == factor.id){
                        contains = true;
                        return;
                    }
                })
            });
            if(!contains) {
                factor.checked = false;
                this.AvailableFactors.push(factor);
            }
        });
    }

    saveFactor(data){
        let relationDetail = {
            templateId: this.selectTemplate.id,
            typeId: this.addType.id,
            moduleId: this.showDataSet.id,
            factorId: data.id
        };
        this.riskEvaluationRelationService.saveOneRelation(relationDetail)
            .subscribe((response) => {
                let containsType = false;
                this.showDataSet.types.forEach((type) => {
                    if(type.id == this.addType.id){
                        containsType = true;
                        type.factors.push(data);
                    }
                });
                if(!containsType){
                    data.expand = false;
                    this.addType.factors = [];
                    this.addType.expand = true;
                    this.addType.factors.push(data);
                    this.showDataSet.types.push(this.addType);
                }
                this.factorVisible = false;
                this.childrenVisible = false;
            })
    }

    saveFactors(){
        this.AvailableFactors.forEach((factor) => {
            if(factor.checked == true){
                this.saveFactor(factor);
            }
        })
    }

    /*----------------  类型 因素 表格 --------------*/

    deleteFactor(type,factor){
        let deleteDetail = {
            templateId: this.selectTemplate.id,
            typeId: type.id,
            moduleId: this.showDataSet.id,
            factorId: factor.id
        };
        this.riskEvaluationRelationService.deleteRelation(deleteDetail)
            .subscribe((response) => {
                this.showDataSet.types.forEach((t) => {
                    if(type.id == t.id){
                        let i = t.factors.indexOf(factor);
                        t.factors.splice(i,1);
                    }
                })
            })
    }

    /*----------------  因素分页表格 ---------------*/


    pageIndex = 1;
    pageSize = 10;
    total = 1;
    allTableChecked = false;
    tableIndeterminate = false;
    searchForm :FormGroup;

    checkAll(value: boolean): void {
        this.AvailableFactors.forEach(data => data.checked = value);
        this.refreshStatus();
    }

    refreshStatus(): void {
        const allChecked = this.AvailableFactors.every(value => value.checked === true);
        const allUnChecked = this.AvailableFactors.every(value => !value.checked);
        this.allTableChecked = allChecked;
        this.indeterminate = (!allChecked) && (!allUnChecked);
    }

    searchData(){
        this.riskEvaluationRelationService.getFactors({}, this.searchForm.value)
            .subscribe((response) => {
                    let factors = response.body.data;
                    this.factorSet = factors;
                    this.chosenAddFactor();
                    this.clearSearchData();
                },
                () => alert('无法加载因素信息'))
    }

    clearSearchData(){
        this.searchForm.reset();
        this.initFactorSet();
    }
}
