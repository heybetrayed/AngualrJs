import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { Routes, RouterModule }  from '@angular/router';

import { AppsCalendar } from './calendar.page';
import { AppsGallery } from './gallery.page';
import { AppsMail } from './mail.page';
import { AppsMessaging } from './messaging.page';
import { AppsProfile } from './profile.page';
import {UserRouteAccessService} from "../../core/auth/user-route-access-service";

export const routes: Routes = [
  {
      path: 'calendar',
      component: AppsCalendar,
      data: {
          authorities: ['ROLE_USER','ROLE_ADMIN'],
          pageTitle: 'calendar'
      },
      canActivate:[UserRouteAccessService]
  },
  {
      path: 'gallery',
      component: AppsGallery,
      data: {
          authorities: ['ROLE_USER','ROLE_ADMIN'],
          pageTitle: 'gallery'
      },
      canActivate:[UserRouteAccessService]
  },
  {
      path: 'mail',
      component: AppsMail,
      data: {
          authorities: ['ROLE_USER','ROLE_ADMIN'],
          pageTitle: 'mail'
      },
      canActivate:[UserRouteAccessService]
  },
  {
      path: 'messaging',
      component: AppsMessaging,
      data: {
          authorities: ['ROLE_USER','ROLE_ADMIN'],
          pageTitle: 'messaging'
      },
      canActivate:[UserRouteAccessService]
  },
  {
      path: 'profile',
      component: AppsProfile,
      data: {
          authorities: ['ROLE_USER','ROLE_ADMIN'],
          pageTitle: 'profile'
      },
      canActivate:[UserRouteAccessService]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    AppsCalendar,
    AppsGallery,
    AppsMail,
    AppsMessaging,
    AppsProfile
  ]

})

export class AppsModule { }
