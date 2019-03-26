export class RiskTodoDto {

    public id: string;
    public name: string;
    public assignee: string;
    public category: string;
    public description: string;
    public processInstanceId: string;
    public processDefinitionId: string;
    public startTime: Date;
    public endTime: Date;
    public procName: string;
    public comments: Array<string>;
    public startUserId: string;

    constructor() {
    }
}
