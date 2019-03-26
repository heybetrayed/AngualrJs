import {RiskFiItDTO} from './riskFiItDTO';

export  class RiskFileDTO {
    public id: number;
    public  rfName: string;
    public  rfFindCount: number;
    public  rfDownCount: number;
    public  rfUrl: string;
    public  updateDate: Date;
    public  updateBy: string;
    public  createDate: Date;
    public  createBy: string;
    public  riskFiIt: RiskFiItDTO;
    public  riskFiItId:string;
    public  departmentId: number;
    public findAndDownType : string;


}