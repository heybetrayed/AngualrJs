export class fileDto {

    //id
    id: string;
    //文件名
    name: string;
    //文件路径
    fileUrl: string;

    constructor(id: string, name: string, fileUrl: string) {
        this.id = id;
        this.name = name;
        this.fileUrl = fileUrl;
    }
}
