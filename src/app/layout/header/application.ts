export class Application {
    public id?: any;
    public icon?:string ;
    public banner?:string ;
    public theme?:string ;
    public basepath?:string ;
    public status?:number ;
    public name?:string ;
    public title?:string ;
    public description?:string ;
    public sort?:number ;

    constructor(
        id?: any,
        icon?:string ,
        banner?:string ,
        theme?:string ,
        basepath?:string ,
        status?:number ,
        name?:string ,
        title?:string ,
        description?:string ,
        sort?:number
    ){
        this.id = id,
        this.banner = banner,
        this.basepath = basepath,
        this.description = description,
        this.icon = icon,
        this.name = name,
        this.sort = sort,
        this.theme = theme,
        this.title = title,
        this.status = status
    }

}
