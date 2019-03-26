import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { Routes, RouterModule }  from '@angular/router';

import { DocumentationIndex } from './index.page';
import {UserRouteAccessService} from "../../core/auth/user-route-access-service";

export const routes: Routes = [
  {
      path: '',
      component: DocumentationIndex,
      data: {
          authorities: ['ROLE_USER','ROLE_ADMIN'],
          pageTitle: '文档'
      },
      canActivate: [UserRouteAccessService]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [ RouterModule ],
  declarations: [
    DocumentationIndex
  ]

})

export class DocumentationModule { }
