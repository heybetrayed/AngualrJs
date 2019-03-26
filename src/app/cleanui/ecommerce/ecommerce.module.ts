import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { Routes, RouterModule }  from '@angular/router';

import { EcommerceCartCheckout } from './cart-checkout.page';
import { EcommerceDashboard } from './dashboard.page';
import { EcommerceOrders } from './orders.page';
import { EcommerceProductDetails } from './product-details.page';
import { EcommerceProductEdit } from './product-edit.page';
import { EcommerceProductsCatalog } from './products-catalog.page';
import { EcommerceProductsList } from './products-list.page';

export const routes: Routes = [
  { path: 'cart-checkout', component: EcommerceCartCheckout },
  { path: 'dashboard', component: EcommerceDashboard },
  { path: 'orders', component: EcommerceOrders },
  { path: 'product-details', component: EcommerceProductDetails },
  { path: 'product-edit', component: EcommerceProductEdit },
  { path: 'products-catalog', component: EcommerceProductsCatalog },
  { path: 'products-list', component: EcommerceProductsList }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    EcommerceCartCheckout,
    EcommerceDashboard,
    EcommerceOrders,
    EcommerceProductDetails,
    EcommerceProductEdit,
    EcommerceProductsCatalog,
    EcommerceProductsList
  ]

})

export class EcommerceModule { }
