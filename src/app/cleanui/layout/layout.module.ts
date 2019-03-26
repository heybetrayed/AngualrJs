import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { Routes, RouterModule }  from '@angular/router';

import { LayoutCards } from './cards.page';
import { LayoutGrid } from './grid.page';
import { LayoutSidebars } from './sidebars.page';
import { LayoutTypography } from './typography.page';
import { LayoutUtilities } from './utilities.page';

export const routes: Routes = [
  { path: 'cards', component:  LayoutCards},
  { path: 'grid', component:  LayoutGrid},
  { path: 'sidebars', component:  LayoutSidebars},
  { path: 'typography', component:  LayoutTypography},
  { path: 'utilities', component:  LayoutUtilities}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    LayoutCards,
    LayoutGrid,
    LayoutSidebars,
    LayoutTypography,
    LayoutUtilities
  ]

})

export class LayoutModule { }
