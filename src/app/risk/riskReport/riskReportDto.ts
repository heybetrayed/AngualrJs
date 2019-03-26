export class RiskReportDto {
    id: number;
    createDate: Date;
    createBy: string;
    updateBy: string;
    updateDate: Date;
    status: string;
    department: string;
    type: number;
    name: string;
    comment: string;
    taskId: number;
    modelId: string;
}
