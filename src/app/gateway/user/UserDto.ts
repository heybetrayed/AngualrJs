import {authoritieDto} from "./authoritieDto";
import {OrganizationDto} from '../organization/organiztionDto';


export class UserDto {

    //id
    id:number;
    //用户账号
    login:string;
    //用户姓名
    firstName:string;
    //用户邮箱
    email :string;
    //所属部门
    organizations:Array<String>;
    organizationObjs:Array<OrganizationDto>;
    //权限名称
    authorities:Array<String>;
    authoritieObjs:Array<authoritieDto>;
    //修改人
    lastModifiedBy:string;
    //修改时间
    lastModifiedDate:string;
    //状态
    activated:number;
    //密码
    passWord : string;
}
