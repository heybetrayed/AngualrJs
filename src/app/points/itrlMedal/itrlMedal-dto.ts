export class ItrlMedalDTO {
    public id:string;
    public medalName:string;
    public medalRemark:string;
    public medalNo:string;
    public updateDate:Date;
    public updateBy:string;
    public createDate:Date;
    public createBy:string;
    public medalStatus:string;
    public medalTypeRelas:Array<MedalTypeRelaDTO>;
    public xfValue:string;
    public cxValue:string;
    public gyValue:string;
    public lsValue:string;
}

export class MedalTypeRelaDTO {
    public id:String;
    public converSymbol:String;
    public converScore:number;
    public itrlTypeId:String;
    public itrlMedalId:String ;
}