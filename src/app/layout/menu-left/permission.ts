export class Permission {
    public id?: any;
    public applicationId?:number ;
    public pId?:number ;
    public name?:string ;
    public type?:number ;
    public permissionValue?:string ;
    public uri?:string ;
    public icon?:string ;
    public status?:number ;
    public sort?:number ;
    public children?:Permission[];

    constructor(
        id?: any,
        applicationId?:number,
        pId?:number ,
        name?:string,
        type?:number ,
        permissionValue?:string ,
        uri?:string ,
        icon?:string ,
        status?:number ,
        sort?:number,
        children?:Permission[]
    ){
        this.id = id,
        this.applicationId = applicationId,
        this.icon = icon,
        this.name = name,
        this.permissionValue = permissionValue,
        this.pId = pId,
        this.type = type,
        this.uri = uri,
        this.sort = sort,
        this.children = children
    }
}
