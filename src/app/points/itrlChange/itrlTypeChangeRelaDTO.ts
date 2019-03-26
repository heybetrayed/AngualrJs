import {ItrlTypeDTO} from '../itrlType/itrlType-dto';

export class ItrlTypeChangeRelaDTO{
    public id:number;
    public changeScore:string;
    public changeSign:string;
    public typeStatus:number;
    public itrlChangeId:string;
    public itrlTypeId:string;
    public itrlType:any=new ItrlTypeDTO();
}