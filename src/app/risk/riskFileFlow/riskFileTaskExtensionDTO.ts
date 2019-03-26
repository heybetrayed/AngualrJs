import {RiskFileDTO} from "../riskFile/riskFileDTO";

export  class RiskFileTaskExtensionDTO {
    public  id : number;
    public  rftName : string;
    public  rftEmergencyLev : string;
    public  rftApprover : string;
    public  rftReceiver: string;
    public  rftStartDate: Date;
    public  rftEndDate: Date;
    public  rfName:string ;
    public  rfUrl: string;
    public  riskFiItId : string;
    public  startEndTime: string;
    public  departmentId : number;

    public riskFileDTOList:Array<RiskFileDTO>;
    public  fiItId : number ;
    public  fileTaskId: number;
}