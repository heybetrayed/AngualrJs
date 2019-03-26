import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { Routes, RouterModule }  from '@angular/router';

import { PagesInvoice } from './invoice.page';
import { PagesPricingTables } from './pricing-tables.page';
import {WebofficeModule} from '../../shared/weboffice/weboffice.module';
import {WebofficeviewerPage} from './webofficeviewer.page';

export const routes: Routes = [
  { path: 'invoice', component: PagesInvoice },
  { path: 'pricing-tables', component: PagesPricingTables },
    { path: 'weboffice', component: WebofficeviewerPage }
];

@NgModule({
  imports: [
    CommonModule,
    WebofficeModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    PagesInvoice,
    PagesPricingTables,
    WebofficeviewerPage
  ]

})
export class PagesModule { }
