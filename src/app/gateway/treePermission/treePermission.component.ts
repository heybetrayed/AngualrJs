import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {jqxTreeComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxtree';
import {TreePermissionService} from './treePermission.service';
import {FormBuilder, FormGroup} from '@angular/forms';


declare var swal: any;

@Component({
    selector: 'cat-page',
    templateUrl: 'treePermission.component.html',
    styleUrls: ['treePermission.component.css']
})

export class TreePermissionComponent {

    searchForm: FormGroup;
    roles:any;
    systems:any;
    systemsByroleId:any;
    showPermission: boolean=false ;
    systemId:string  = '0';
    roleId : string;
    treeIds:any[];


    @ViewChild('myTree') myTree:jqxTreeComponent;

    constructor(private fb: FormBuilder,
                private treePermissionService : TreePermissionService) {
        this.searchForm = this.fb.group({
            roleId: []
        })
    }

    source ={
        datatype:'json',
        datafields:[
            {name:'id'},
            {name:'pId'},
            {name:'name'},
        ],
        id:'id',
        url: this.treePermissionService.getPermissionByAppIdUrl(this.systemId),
        //异步加载
        async: false
    };
    dataAdapter =new jqx.dataAdapter(this.source,{autoBind: true});
    records:any = this.dataAdapter.getRecordsHierarchy('id','pId','items',[{name:'name',map:'label'}]);


    ngOnInit(): void {
        //查询角色
        this.treePermissionService.getAllRole().subscribe((response) => {
            this.roles = response.body;
        });
        //查询所有系统
        this.treePermissionService.getAllApplications().subscribe((response) => {
            this.systems=response.body;
        });

    }

    myCheckBoxOnChange(event:any):void{
        let checked = event.args.checked;
        this.myTree.hasThreeStates(checked);
    }

    showChack(){
        //查询角色对应的系统
        this.treePermissionService.getAllAppByauthorityId(this.searchForm.value.roleId).subscribe((response) => {
            this.systemsByroleId=response.body;
        });
        this.showPermission=false;
    }

    // 点击系统显示对应的权限
    getPermission(systemId){
        if(null == this.searchForm.value.roleId){
            this.errorSwal('请选择角色');
        }else{
            this.systemId=systemId;
            this.source.url=  this.treePermissionService.getPermissionByAppIdUrl(this.systemId);
            this.dataAdapter =new jqx.dataAdapter(this.source,{autoBind: true});
            this.records = this.dataAdapter.getRecordsHierarchy('id','pId','items',[{name:'name',map:'label'}]);
            this.selectPermission();
            this.showPermission=true;
        }
    }

    selectPermission(){
        const that = this;
            this.treePermissionService.getPermissionByAppIdAndAuthorityId(this.systemId,this.searchForm.value.roleId).subscribe((response) => {
                response.body.forEach((id)=>{
                    let ele =  document.getElementById(id);
                    that.myTree.expandItem(ele);
                    that.myTree.checkItem(ele,true);
                });
            });
    }
    /*-------------------------------保存-----------------------------*/
    save() {
        this.treeIds = [];
        this.treeIds.push( this.searchForm.value.roleId);
        this.treeIds.push( this.systemId);
        this.myTree.getCheckedItems().forEach((treeItemId)=>{
            this.treeIds.push(treeItemId.element.id) ;
        });
        //新增关系
        this.treePermissionService.save(this.treeIds).subscribe((response) => {

            this.successSwal('编辑成功');
            this.showChack();
            //刷新页面
            // location.reload();
        });
    }


    /*-------------------------------树功能-----------------------------*/
    collapseAll(){
        this.myTree.collapseAll();
    }

    expandAll(){
        this.myTree.expandAll();
    }

    checkAll(){
        this.myTree.checkAll();
    }
    uncheckAll(){
        this.myTree.uncheckAll();
    }

    /*-------------------------------提示信息-----------------------------*/

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

