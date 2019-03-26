export class RiskDigitizationDTO {

    public id: number;
    public name: string;
    public type: string;
    public createBy: string;
    public createDate: Date;
    public updateBy: string;
    public updateDate: Date;
    public status: number;
    public version: number;

    constructor(id: number, name: string, type: string, createBy: string, createDate: Date, updateBy: string, updateDate: Date, status: number, version: number) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.createBy = createBy;
        this.createDate = createDate;
        this.updateBy = updateBy;
        this.updateDate = updateDate;
        this.status = status;
        this.version = version;
    }
}
