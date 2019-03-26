export  class RiskDocumentsDTO {
    public id: number;
    public docName: string;
    public docSize: string;
    public docPath: string;
    public docUpLoadDate: Date;
    public docPostfix: string;
    public docType: string;
    public docUploadBy: string;
    public docDownLoadCount: number;
    public docViewCount: number;
    public docEditCount: number;
    public status: number;
}