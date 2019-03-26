import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {PagesLockscreen} from "./lockscreen.page";

export const routes: Routes = [
    { path: 'lockscreen', component: PagesLockscreen},
];


@NgModule({
  imports: [
    CommonModule,
      RouterModule.forRoot(routes)
  ],
  declarations: []
})
export class LockscreenModule { }
