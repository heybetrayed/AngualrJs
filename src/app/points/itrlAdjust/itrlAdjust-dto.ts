import {ItrlTypeDTO} from '../itrlType/itrlType-dto';

export class ItrlMemDTO {
    public id: string;

    public memNo: string;

    public memAccountType: number;

    public memPhone: string;

    public memName: string;

    public createBy: string;

    public createDate: Date;

    public updateBy: string;

    public updateDate: Date;

    public memStatus: number;

    public memTypeRelas: Array<MemTypeRelaDTO>;
}

export class MemTypeRelaDTO {
    public id: string;

    public integralStatus: number;

    public currentScore: number;

    public itrlTypeId: string;

    public itrlMemId: string;

    public itrlType: ItrlTypeDTO;

    //即将生效积分
    public evenValidItrl: number;

    //即将失效
    public evenInValidItrl: number;

    //冻结
    public freezeItrl: number;
}

export class TransferItemDTO{
    public id:string;

    public oldScore:string;//调整前的积分值

    public oldScoreStaus:string;//调整前的积分状态

    public newScore:string;//调整后的积分值

    public newScoreStaus:string;//调整后的积分状态

    public applicatID:string;//申请人id

    public applicatName:string;//申请人名称

    public applyTime:Date;//申请时间

    public itrlTypeId:string;//积分类型

    public itrlType:ItrlTypeDTO;//积分类型对象

    public transferId:string;//调整积分任务id
}

export class TransferDTO{
    public id:string;

    public transferType:string;//调整类型

    public transferReason:string;//调整原因

    public applyTime:Date;//申请时间

    public startEndApplyTime:string;//起始申请时间

    public startEndApproveTime:string;//起始审批时间

    public approveTime:Date;//审批时间

    public transferNo:string;//调整编号

    public oldItrlMemStatus:number;//调整前积分账户状态

    public newItrlMemStatus:number;//调整后积分账户状态

    public processInstanceId:string;//流程实例编号

    public applicatId:string;//申请人id

    public applicatName:string;//申请人名称

    public approveId:string;//审批人id

    public approveName:string;//审批人名称

    public approveStatus:string;//审核状态 0:待审核 1:审核通过 2:审核拒绝 3:失效

    public approveExplain:string;//审核说明

    public itrlMem:ItrlMemDTO;//被调整的客户积分账户

    public transferAfterDTOS:Array<TransferItemDTO>;
}

