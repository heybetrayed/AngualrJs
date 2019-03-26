import {DditItemDto} from '../dataItemManage/dditItem-dto';

export class ItrlLimit {
    public id:string;
    public limitNo:string;
    public limitName:string;
    public limitStatus:number;
    public limitSymbol:number;
    public limitLev:string;
    public limitScore:string;
    public limitRemark:string;
    public updateDate:Date;
    public updateBy:string;
    public createDate:Date;
    public createBy:string;
    public itrlTies:Array<ItrlTypeDTO>;
    public itrlTypeId:string;
    public dditItemList:Array<DditItemDto>;
}

export class ItrlTypeDTO{
    public id:string;
    public typeName:string;
    public typeSwitch:number;
    public createBy:string;
    public createDate:Date;
    public updateBy:string;
    public updateDate:Date;
    public typeStatus:number;
    public typeDate:string;
}
