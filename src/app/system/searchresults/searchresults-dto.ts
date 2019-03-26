import {ConfparameterDto} from '../confparameter/confparameter-dto';

export  class  SearchresultsDto{
    public id:string;
    public srAppName:string;
    public srStatus:string;
    public srRemark:String;
    public srDate:Date;
    public createBy:String;
    public createDate:Date;
    public updateDate:Date;
    public updateBy:string;
    public confParametersDto:ConfparameterDto;
    public startEndTime:string;
}