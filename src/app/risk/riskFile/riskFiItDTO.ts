import {RiskFileDTO} from './riskFileDTO';

export  class RiskFiItDTO {

    public id: number;
    public departmentId: number;
    public departmentName: string;
    public rfiStatus: number;
    public updateDate: Date;
    public updateBy: string;
    public createDate: Date;
    public createBy: string;
    public riskFiles: Array<RiskFileDTO>;



}