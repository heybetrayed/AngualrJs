import {ItrlTypeChangeRelaDTO} from './itrlTypeChangeRelaDTO';
import {ItrlLimitDTO} from './itrlLimitDTO';
import {ChangeProductRelaDTO} from './changeProductRelaDTO';

export class ItrlChangeDTO {
    public id: string;
    public changeNo: string;
    public changeName: string;
    public changeRemark: string;
    public changeStatus: number;
    public changeMemStatus: Number;
    public changeFrequency:number;
    public updateDate: Date;
    public updateBy: string;
    public createDate: Date;
    public createBy: string;
    public itrlTypeChangeRelas: Array<ItrlTypeChangeRelaDTO>;
    public itrlLimits: Array<ItrlLimitDTO>;
    public changeProduct: Array<ChangeProductRelaDTO>;
    public productId: string;
}
