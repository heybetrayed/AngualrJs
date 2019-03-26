export class RiskTaskDTO {
    public id: number;
    public taskName: string;
    public startTime: Date;
    public endTime: Date;
    public updateDate: Date;
    public updateBy: string;
    public createDate: Date;
    public createBy: string;
    public status: number;
    public content: string;
    public monitorTypeId: number;
    public emailAndName: string[];
    public downloadPath: string;


}