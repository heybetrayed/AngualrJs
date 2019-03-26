import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { Routes, RouterModule }  from '@angular/router';
import {PagesLogin} from "./login.page";
import {LoginService} from "./login.service";

export const routes: Routes = [
  { path: 'login', component: PagesLogin},
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  declarations: [
      PagesLogin,
  ],
  providers:  [
      LoginService
  ]

})
export class LoginModule { }
