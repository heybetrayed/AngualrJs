import {Inject, Injectable} from '@angular/core';
import {Application} from "../../layout/header/application";
import {Permission} from "../../layout/menu-left/permission";
import {UserRouteAccessService} from "../auth/user-route-access-service";
import {Principal} from "../auth/principal.service";
import {inject} from "@angular/core/testing";

@Injectable()
export class AuxiliaryService {

  public applications: Application[];
  public permissions: Permission[];

  constructor(
      private principal:Principal,
  ) { }

    public getPermissions(): Permission[] {
        try {
            if (this.permissions != null) {
                return this.permissions;
            }
            else if(this.principal.isAuthenticated()) {
                let back: string = localStorage.getItem("permissions")
                this.permissions = JSON.parse(back) as Permission[];
                return this.permissions;
            }
        }
        catch (error) {
            console.error(`核心模块内服务 : AuxiliaryService , 内部函数 : getPermissions 。发生异常:`, error);
            return null;
        }
    }

    public getApplications(): Application[] {
        try {
            if (this.applications != null) {
                return this.applications;
            }
            else if(this.principal.isAuthenticated()) {
                let back: string = localStorage.getItem("applications")
                this.applications = JSON.parse(back) as Application[];
                return this.applications;
            }
        }
        catch (error) {
            console.error(`核心模块内服务 : AuxiliaryService , 内部函数 : getApplications 。发生异常:`, error);
            return null;
        }
    }

}
