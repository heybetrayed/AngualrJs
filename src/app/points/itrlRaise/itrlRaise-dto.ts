export class RaiseItrlDTO {
    public memNo:string;
    public itrlTypeList:Array<ItrlTypeHelperDto> ;
    public changeNo:string;
    public tinkerCause:string;
    public itrlSource:string;
}

export class ItrlTypeHelperDto{
    public itrlType:string;
    public itrlNumber:number;
}
