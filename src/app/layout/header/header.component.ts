import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LoginService} from '../../login/login.service';
import {CoreService} from '../../core/core.service';
import {Application} from './application';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';
import {Title} from '@angular/platform-browser';


@Component({
    selector: 'cat-top-bar',
    templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
    error: any;
    success: any;
    @Output() eventEmitter = new EventEmitter();
    applicationError: any;
    appName: string;
    @Input() applications: Application[];
    @Input() application: Application;

    constructor(
        private router: Router,
        private loginService: LoginService,
        private titleService: Title,
        private coreService: CoreService,
        private render2: Renderer2) {

    }

    ngOnInit() {

    }

    // 更换系统
    changeApplication(app: Application) {
        // 更换主题
        this.render2.removeAttribute(document.body, 'class');
        this.render2.setAttribute(document.body, 'class', 'cat__config--vertical cat__menu-left--colorful cat__menu-left--visible '
            + app.theme);
        this.render2.removeAttribute(document.body, 'theme');
        this.render2.setAttribute(document.body, 'theme', app.theme);

        this.eventEmitter.emit(app);
        // 选择默认工作台
        sessionStorage.setItem('appSel', JSON.stringify(app));

        // 跳转到首页
        this.router.navigate([app.basepath]);

    }

    // 退出
    logout() {
        // 清空
        sessionStorage.clear();
        this.loginService.logout();
        this.router.navigate(['/login']);
    }

    // ngOnChanges(changes: SimpleChanges): void {
    //     if(changes['applications'] && changes['applications'].currentValue) {
    //         // 根据当前登录人的权限显示系统
    //         this.applications = changes['applications'].currentValue;
    //
    //         this.application = JSON.parse(sessionStorage.getItem('appSel'));
    //         if(this.application == null){
    //             this.application = this.applications[0];
    //         }
    //     }
    //
    // }

}
