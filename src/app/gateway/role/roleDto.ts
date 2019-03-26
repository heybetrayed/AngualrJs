export interface roleDto {

   //title
    title:string;
    //角色名称
    name:string;
    //角色说明
    description:string;
    //权限
    permissions:Array<PermissionDTO>;

    applications:Array<ApplicationDTO>;
}

export class PermissionDTO{
    id:number;
    applicationId:number;
    pId:number;
    name:string;
    type:number;
    permissionValue:string;
    uri:string;
    icon:string;
    status:number;
    ctime:Date;
    sort:number;
    children:Array<PermissionDTO>;
}

export class ApplicationDTO{
    id:number;
    name:string;
    title:string;
    description:string;

}

