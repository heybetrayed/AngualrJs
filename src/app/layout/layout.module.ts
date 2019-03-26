import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from "./header/header.component";
import {FooterComponent} from "./footer/footer.component";
import {MenuRightComponent} from "./menu-right/menu-right.component";
import {MenuLeftComponent} from "./menu-left/menu-left.component";
import {FormsModule} from "@angular/forms";
import {RouterModule} from '@angular/router';
import {LayoutComponent} from "./layout.component";
import {PagesLockscreen} from "../lockscreen/lockscreen.page";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule
    ],
    declarations: [
        LayoutComponent,
        HeaderComponent,
        MenuLeftComponent,
        MenuRightComponent,
        FooterComponent,
        PagesLockscreen
    ],
    providers: [
    ],
    entryComponents: [

    ],
    exports: [
        LayoutComponent,
        HeaderComponent,
        MenuLeftComponent,
        MenuRightComponent,
        FooterComponent
    ]
})
export class LayoutModule {}
