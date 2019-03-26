import {SearchresultsDto} from '../searchresults/searchresults-dto';

export class OperationlogDto{
    public id:string;
    public olLogs:string;
    public createBy:string;
    public updateBy:string;
    public createDate:Date;
    public updateDate:Date;
    public searchResults:SearchresultsDto;

    public srAppName:string;

    public startEndTime:string;
}