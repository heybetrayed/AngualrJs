import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PagesRegister} from "./register.page";
import {PagesLogin} from "../login/login.page";
import {RouterModule, Routes} from "@angular/router";

export const routes: Routes = [
    { path: 'register', component: PagesRegister},
];


@NgModule({
  imports: [
    CommonModule,
      RouterModule.forRoot(routes)
  ],
  declarations: [
      PagesRegister
  ]
})
export class RegisterModule { }
