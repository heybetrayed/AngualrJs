import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { Routes, RouterModule }  from '@angular/router';

import { FormsAutocomplete } from './autocomplete.page';
import { FormsBasicFormElements } from './basic-form-elements.page';
import { FormsButtons } from './buttons.page';
import { FormsCheckboxesRadio } from './checkboxes-radio.page';
import { FormsDropdowns } from './dropdowns.page';
import { FormsExtras } from './extras.page';
import { FormsFileUploads } from './file-uploads.page';
import { FormsFormValidation } from './form-validation.page';
import { FormsFormWizard } from './form-wizard.page';
import { FormsInputMask } from './input-mask.page';
import { FormsSelectboxes } from './selectboxes.page';

export const routes: Routes = [
  { path: 'autocomplete', component: FormsAutocomplete },
  { path: 'basic-form-elements', component: FormsBasicFormElements },
  { path: 'buttons', component: FormsButtons },
  { path: 'checkboxes-radio', component: FormsCheckboxesRadio },
  { path: 'dropdowns', component: FormsDropdowns },
  { path: 'extras', component: FormsExtras },
  { path: 'file-uploads', component: FormsFileUploads },
  { path: 'form-validation', component: FormsFormValidation },
  { path: 'form-wizard', component: FormsFormWizard },
  { path: 'input-mask', component: FormsInputMask },
  { path: 'selectboxes', component: FormsSelectboxes },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    FormsAutocomplete,
    FormsBasicFormElements,
    FormsButtons,
    FormsCheckboxesRadio,
    FormsDropdowns,
    FormsExtras,
    FormsFileUploads,
    FormsFormValidation,
    FormsFormWizard,
    FormsInputMask,
    FormsSelectboxes
  ]

})

export class FormsModule { }
