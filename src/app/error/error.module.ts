import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Pages404} from "./page404/page404.page";
import {Pages500} from "./page500/page500.page";
import {RouterModule, Routes} from "@angular/router";

export const routes: Routes = [
    { path: '404', component: Pages404},
    { path: '500', component: Pages500},
];


@NgModule({
  imports: [
    CommonModule,
     RouterModule.forRoot(routes)
  ],
  declarations: [
      Pages404,
      Pages500
  ],

})
export class ErrorModule { }
