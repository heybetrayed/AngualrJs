import {authoritieDto} from '../../gateway/user/authoritieDto';

export class ItrlEventDto {

    public id:  string;

    public eventName  : string

    public eventCode  :string

    public eventRemark :string

    public createBy :string

    public createDate :Date

    public updateBy  :string

    public updateDate :Date

    public eventStatus : boolean

    public eventChangeRelas:Array<EventChangeRelaDto>;

}



export class EventChangeRelaDto {
    public id:  string;
    public eventCode  : string;
    public changeNo    :string;
    public eventService  :string;
}