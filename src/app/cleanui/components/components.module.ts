import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { Routes, RouterModule }  from '@angular/router';
import { FormsModule }   from '@angular/forms';

import { ComponentsBadgesLabels } from './badges-labels.page';
import { ComponentsBreadcrumbs } from './breadcrumbs.page';
import { ComponentsCalendar } from './calendar.page';
import { ComponentsCarousel } from './carousel.page';
import { ComponentsCollapse } from './collapse.page';
import { ComponentsDatePicker } from './date-picker.page';
import { ComponentsLoadingProgress } from './loading-progress.page';
import { ComponentsMailTemplates } from './mail-templates.page';
import { ComponentsMediaPlayers } from './media-players.page';
import { ComponentsModal } from './modal.page';
import { ComponentsNestable } from './nestable.page';
import { ComponentsNotificationsAlerts } from './notifications-alerts.page';
import { ComponentsPagination } from './pagination.page';
import { ComponentsProgressBars } from './progress-bars.page';
import { ComponentsSlider } from './slider.page';
import { ComponentsSteps } from './steps.page';
import { ComponentsTabs } from './tabs.page';
import { ComponentsTextEditor } from './text-editor.page';
import { ComponentsTooltipsPopovers } from './tooltips-popovers.page';
import { ComponentsNgBootstrap } from './ng-bootstrap.page';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

export const routes: Routes = [
  { path: 'badges-labels', component: ComponentsBadgesLabels },
  { path: 'breadcrumbs', component: ComponentsBreadcrumbs },
  { path: 'calendar', component: ComponentsCalendar },
  { path: 'carousel', component: ComponentsCarousel },
  { path: 'collapse', component: ComponentsCollapse },
  { path: 'date-picker', component: ComponentsDatePicker },
  { path: 'loading-progress', component: ComponentsLoadingProgress },
  { path: 'mail-templates', component: ComponentsMailTemplates },
  { path: 'media-players', component: ComponentsMediaPlayers },
  { path: 'modal', component: ComponentsModal },
  { path: 'nestable', component: ComponentsNestable },
  { path: 'notifications-alerts', component: ComponentsNotificationsAlerts },
  { path: 'pagination', component: ComponentsPagination },
  { path: 'progress-bars', component: ComponentsProgressBars },
  { path: 'slider', component: ComponentsSlider },
  { path: 'steps', component: ComponentsSteps },
  { path: 'tabs', component: ComponentsTabs },
  { path: 'text-editor', component: ComponentsTextEditor },
  { path: 'tooltips-popovers', component: ComponentsTooltipsPopovers },
  { path: 'ng-bootstrap', component: ComponentsNgBootstrap }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
    FormsModule
  ],
  declarations: [
    ComponentsBadgesLabels,
    ComponentsBreadcrumbs,
    ComponentsCalendar,
    ComponentsCarousel,
    ComponentsCollapse,
    ComponentsDatePicker,
    ComponentsLoadingProgress,
    ComponentsMailTemplates,
    ComponentsMediaPlayers,
    ComponentsModal,
    ComponentsNestable,
    ComponentsNotificationsAlerts,
    ComponentsPagination,
    ComponentsProgressBars,
    ComponentsSlider,
    ComponentsSteps,
    ComponentsTabs,
    ComponentsTextEditor,
    ComponentsTooltipsPopovers,
    ComponentsNgBootstrap
  ]

})

export class ComponentsModule { }
