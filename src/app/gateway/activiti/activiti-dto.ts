export class ActivitiDto {

    public id: string;
    public name: string;
    public key: string;
    public description: string;



    constructor(id: string, name: string, key: string, description: string) {
        this.id = id;
        this.name = name;
        this.key = key;
        this.description = description;
    }
}
