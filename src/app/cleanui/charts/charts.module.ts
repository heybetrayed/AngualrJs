import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { Routes, RouterModule }  from '@angular/router';

import { ChartsC3 } from './c3.page';
import { ChartsChartistJs } from './chartistjs.page';
import { ChartsChartJs } from './chartjs.page';
import { ChartsPeity } from './peity.page';

export const routes: Routes = [
  { path: 'c3', component: ChartsC3 },
  { path: 'chartistjs', component: ChartsChartistJs },
  { path: 'chartjs', component: ChartsChartJs },
  { path: 'peity', component: ChartsPeity }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    ChartsC3,
    ChartsChartistJs,
    ChartsChartJs,
    ChartsPeity
  ]

})

export class ChartsModule { }
