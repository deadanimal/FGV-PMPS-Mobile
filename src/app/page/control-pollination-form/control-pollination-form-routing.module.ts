import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ControlPollinationFormPage } from './control-pollination-form.page';

const routes: Routes = [
  {
    path: '',
    component: ControlPollinationFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControlPollinationFormPageRoutingModule {}
