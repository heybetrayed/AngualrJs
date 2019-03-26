export class RiskNewsDTO {
    public id: number;
    public nsTitle: string;
    public nsType: number;
    public nsContent: string;
    public createBy: string;
    public createDate: Date;
    public updateBy: string;
    public updateDate: Date;
    public status: string;

    constructor(nsTitle: string, nsType: number, nsContent: string) {
        this.nsTitle = nsTitle;
        this.nsType = nsType;
        this.nsContent = nsContent;
    }

}