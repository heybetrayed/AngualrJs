export class ItrlRecordDto {

    id: number;

    raiseTranactionNum: string;

    //增加积分值
    raiseScore: number;

    //积分增减
    itrlChange: string;

    //变动日期
    raiseGainDate: string;

    //积分类型
    raiseItrlType: string;

    //积分状态
    raiseStatus: number;

    //有效期
    raiseValidDate: string;

    //渠道
    raiseIntegralSource: string;

    //剩余积分
    raiseSurplus: string;

    //客户ID
    itrlMemId: string;

    //起始时间
    startEndTime:Date;
}
