import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {Router, NavigationStart, NavigationEnd, Routes, RouterModule, RouteReuseStrategy} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AppComponent} from './app.component';
import {LoginModule} from './login/login.module';
import {HttpModule} from '@angular/http';
import {LayoutModule} from './layout/layout.module';
import {CoreModule} from './core/core.module';
import {PointsModule} from './points/points.module';
import {RegisterModule} from './register/register.module';
import {ErrorModule} from './error/error.module';
import {LockscreenModule} from './lockscreen/lockscreen.module';
import {Pages404} from './error/page404/page404.page';
import {UserRouteAccessService} from './core/auth/user-route-access-service';
import {HashLocationStrategy, LocationStrategy, registerLocaleData} from '@angular/common';
import {GateWayModule} from './gateway/gateway.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DateFormatPipe, MomentModule} from 'angular2-moment';
import {HttpClientModule} from '@angular/common/http';
import {BoccommonModule} from './boccommon/boccommon.module';
import {Dashboard} from './dashboard/dashboard.page';
import {LayoutComponent} from './layout/layout.component';
import {SystemModule} from './system/system.module';
import {EmailModule} from './email/email.module';
import {RiskModule} from './risk/risk.module';
import {CleanuiModule} from './cleanui/cleanui.module';
import {NgZorroAntdModule, NZ_I18N, zh_CN} from 'ng-zorro-antd';
import localeZh from '@angular/common/locales/zh';
import {NgxWebstorageModule} from 'ngx-webstorage';

declare var NProgress: any;

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: 'dashboard',
                component: Dashboard,
                pathMatch: 'full',
                data: {
                    title: '工作台',
                    module: 'dashboard'
                }
            }
        ],
        canActivate: [UserRouteAccessService]
    },
    {path: '**', component: Pages404},
];

@NgModule({
    declarations: [
        AppComponent,
        Dashboard,
    ],
    imports: [
        HttpModule,
        HttpClientModule,
        BrowserModule,
        NgxWebstorageModule.forRoot(),
        CoreModule,
        LayoutModule,
        FormsModule,
        ReactiveFormsModule,
        LoginModule,
        RegisterModule,
        ErrorModule,
        MomentModule,
        LockscreenModule,
        NgbModule.forRoot(),
        GateWayModule,
        PointsModule,
        BoccommonModule,
        SystemModule,
        EmailModule,
        RiskModule,
        CleanuiModule,
        RouterModule.forRoot(routes),
        NgZorroAntdModule.forRoot()
    ],
    providers: [
        UserRouteAccessService,
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        DateFormatPipe,
        {provide: NZ_I18N, useValue: zh_CN}

    ],
    bootstrap: [AppComponent]
})

export class AppModule {
    constructor(private router: Router) {
        registerLocaleData(localeZh);
        router.events.subscribe((event) => {

            if (event instanceof NavigationStart) {
                NProgress.start();
            }

            if (event instanceof NavigationEnd) {
                setTimeout(function () {
                    NProgress.done();
                }, 200);
            }
        });
    }
}
