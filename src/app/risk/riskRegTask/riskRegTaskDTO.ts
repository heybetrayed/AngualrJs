import {RiskDocumentsDTO} from './riskDocumentsDTO';

export  class RiskRegTaskDTO {
    public  id: number;
    public  rTStartDept: string;
    public  rTStartName: string;
    public  rTLevel: number;
    public  rTStartTime: Date;
    public  rTEndTime: Date;
    public  startEndTime: Array<Date>;
    public  processId: string;
    public  updateDate: Date;
    public  updateBy: string;
    public  createDate:string;
    public  createBy: string;
    public  status : string;
    public  documents: Array<RiskDocumentsDTO>;

}