import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {
    NzDropdownContextComponent,
    NzDropdownService,
    NzFormatEmitEvent,
    NzMessageService,
    NzModalService,
    NzTreeComponent,
    NzTreeNode
} from 'ng-zorro-antd';
import {ReportCatalogService} from './reportCatalog.service';
import {ReportCatalogDTO} from './reportCatalogDTO';

@Component({
    templateUrl: './reportCatalog.component.html',
    styleUrls: ['./reportCatalog.component.css'],
    selector: 'app-reportcatalog'
})
export class ReportCatalogComponent implements OnInit {

    // 查询form
    searchForm: FormGroup;
    // 验证form
    validateForm: FormGroup;
    // 筛选条件
    reportCatalogDTO: ReportCatalogDTO;
    //
    @ViewChild('treeCom') treeCom: NzTreeComponent;
    //
    dropdown: NzDropdownContextComponent;
    // actived node
    activedNode: NzTreeNode;
    //
    nodes = []

    // 分页参数
    pageIndex = 1;
    pageSize = 10;
    total = 1;
    dataSet = [];
    loading = true;
    sortKey = null;
    sortValue = null;
    reportCatalogDTOs: any;
    catalogId = -1;

    allChecked = false;
    indeterminate = false;

    // 弹出框
    isReportCatalogVisible = false;
    isReportCatalogDetailVisible = false;

    constructor(
        private reportCatalogService: ReportCatalogService,
        private modalService: NzModalService,
        private nzMessageService: NzMessageService,
        private fb: FormBuilder,
        private nzDropdownService: NzDropdownService,
        private messageService: NzMessageService
    ) {
        this.searchForm = this.fb.group({
            name: '',
            rangeDateTime: ''
        })

        this.validateForm = this.fb.group({
            name: [null, [Validators.required]],
        });
    }


    ngOnInit(): void {
        this.searchData();
    }

    // 搜索数据
    searchData(reset: boolean = false): void {
        this.reportCatalogDTO = this.searchForm.value;
        this.reportCatalogDTO.startTime = this.searchForm.value.rangeDateTime[0];
        this.reportCatalogDTO.endTime = this.searchForm.value.rangeDateTime[1];
        if (reset) {
            this.pageIndex = 1;
        }
        this.loading = true;
        const params = {
            page: this.pageIndex - 1,
            size: this.pageSize,
        };

        if (null !== this.sortKey && null !== this.sortValue) {
            this.sortValue = this.sortValue === 'descend' ? 'desc' : 'asc';
            params['sort'] = this.sortKey + ',' + this.sortValue;
        }

        this.reportCatalogService.listAllReportCatalog(this.reportCatalogDTO, params)
            .subscribe((response: any) => {
                this.loading = false;
                this.total = response.body.recordsTotal;
                this.reportCatalogDTOs = response.body.data;
            });
    }

    showReportCataloModal() {
        this.isReportCatalogVisible = true;
    }

    showReportCataloDetailModal(id) {

        this.catalogId = id;

        this.isReportCatalogDetailVisible = true;

        const that = this;
        if (id == '' || null == id) {
            this.nzMessageService.error('请选中数据！');
            return;
        }
        this.reportCatalogDTO.id = id;
        this.reportCatalogService.getReportCatalogDetailById(this.reportCatalogDTO).subscribe((response) => {

            that.nodes = [new NzTreeNode(response.body)];

        }, (error) => this.nzMessageService.error('查询数据错误'));


    }

    // 全选
    checkAll(value: boolean): void {
        this.reportCatalogDTOs.forEach(data => data.checked = value);
    }


    // 提交表单
    submitForm(): void {
        /* for (const i in this.validateForm.controls) {
             this.validateForm.controls[i].markAsDirty();
             this.validateForm.controls[i].updateValueAndValidity();
         }*/
        const that = this;
        this.reportCatalogDTO = this.validateForm.value;
        this.reportCatalogService.savaReportCatalog(this.reportCatalogDTO).subscribe((response) => {


            this.messageService.success('保存成功！');
            this.handleCancel();
            this.searchData();


        }, (error) => {
            this.messageService.error('保存失败！');
        });


        // 关闭弹窗
        this.isReportCatalogVisible = false;

    }

    // 重置
    resetForm(): void {
        this.validateForm.reset();
        for (const key in this.validateForm.controls) {
            this.validateForm.controls[key].markAsPristine();
            this.validateForm.controls[key].updateValueAndValidity();
        }
    }

    handleCancel(): void {
        console.log('Button cancel clicked!');
        this.isReportCatalogVisible = false;
    }

    handleDetailCancel(): void {
        console.log('Button cancel clicked!');
        this.isReportCatalogDetailVisible = false;
    }

    handleDetailOk(): void {

        //  提交
        const that = this;
        this.reportCatalogService.saveReportDetail(this.catalogId, JSON.stringify(this.treeCom.getTreeNodes()[0].getChildren(), ['title', 'key', 'children'])).subscribe((response: any) => {
            that.isReportCatalogDetailVisible = false;
            that.messageService.success('保存成功！');
        }, (error) => {
            that.messageService.error('保存失败！');
        });

    }

    openFolder(data: NzTreeNode | NzFormatEmitEvent): void {
        // do something if u want
        if (data instanceof NzTreeNode) {
            data.isExpanded = !data.isExpanded;
        } else {
            data.node.isExpanded = !data.node.isExpanded;
        }
    }

    activeNode(data: NzFormatEmitEvent): void {
        if (this.activedNode) {
            // delete selectedNodeList(u can do anything u want)
            this.treeCom.nzTreeService.setSelectedNodeList(this.activedNode);
        }
        data.node.isSelected = true;
        this.activedNode = data.node;
        // add selectedNodeList
        this.treeCom.nzTreeService.setSelectedNodeList(this.activedNode);
    }

    contextMenu($event: MouseEvent, template: TemplateRef<void>): void {
        this.dropdown = this.nzDropdownService.create($event, template);
    }

    addNode(): void {
        this.dropdown.close();
        // 获取选中的节点
        this.treeCom.getSelectedNodeList().forEach((node) => {

            let nodeKey = Number.parseInt(node.key + node.getChildren().length);
            let nzTreeNode = [{
                title: ' ',
                key: nodeKey + 1,
                expanded: true,
                children: []
            }];

            node.addChildren(nzTreeNode);

        })
    }

    editorNode(): void {
        this.dropdown.close();
        // do something
        this.treeCom.getSelectedNodeList().forEach((editorNode) => {

        })
    }

    deleteNode(): void {
        this.dropdown.close();
        const that = this;
        // do something
        this.treeCom.getSelectedNodeList().forEach((removeNode) => {
            let parentNode = removeNode.getParentNode();

            if (removeNode.key == that.catalogId.toString()) {
                that.messageService.warning('目录模板不可删除！')
                return false;
            }

            if (removeNode.children.length !== 0) {
                that.messageService.warning('请移除子节点后在进行删除！');
                return false;
            }


            let childrens = parentNode.getChildren().filter(node => node !== removeNode);
            parentNode.clearChildren();
            parentNode.addChildren(childrens);
        })
    }


    // 排序
    sort(sort: { key: string, value: string }): void {
        this.sortKey = sort.key;
        this.sortValue = sort.value;
        this.searchData();
    }


    nzEvent(event: NzFormatEmitEvent): void {
        // 更新排序
        console.log(event);
    }

    /*    successSwal(message): void {
            this.messageService.success(message);
        }

        errorSwal(message): void {
            this.messageService.error(message)
        }*/


}

