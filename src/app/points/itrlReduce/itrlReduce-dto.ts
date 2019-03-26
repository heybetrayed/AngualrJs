export class ItrlReduceDto {

    public memNo:string;
    public itrlTypeList:Array<ItrlTypeHelperDto> ;
    public limitNo:string;
    public thinkCause:string;
    public itrlSource:string;
}

export class ItrlTypeHelperDto{
    public itrlType:string;
    public itrlNumber:number;
}