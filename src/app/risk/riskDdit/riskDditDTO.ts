export class RiskDditDTO {
    public id: number;
    public dditCode: string;
    public dditName: string;
    public updateDate: Date;
    public updateBy: string;
    public createDate: Date;
    public createBy: string;
    public status: number;

}


export class RiskDditItemDTO {
    public id: number;
    public dditItemCode: string;
    public dditItemName: string;
    public dditId: number;
}