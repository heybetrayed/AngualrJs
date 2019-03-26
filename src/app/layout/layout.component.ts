import {Component, OnInit} from '@angular/core';
import {CoreService} from '../core/core.service';
import {Application} from './header/application';
import {Permission} from './menu-left/permission';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html'
})
export class LayoutComponent implements OnInit {

    menushow: boolean = true;
    allApplication: Application[];
    permissions: Array<Permission> = [];
    selapplication: Application;

    constructor(
        private coreService: CoreService
    ) {

    }

    ngOnInit() {
        // 根据当前登录人的权限显示系统
        this.coreService.getApplicationsByRole().subscribe(
            response => {
                this.allApplication = response.body;
                this.selapplication = JSON.parse(sessionStorage.getItem('appSel'));
                if (null == this.selapplication) {
                    this.selapplication = this.allApplication[0];
                }
                // 加载菜单
                this.coreService.searchPermissionByAppId(this.selapplication.id).subscribe(
                    response => {
                        this.permissions = response.body
                    }
                );
            }
        );
    }

    getSelApplication(app: Application) {
        this.selapplication = app;
    }
}
