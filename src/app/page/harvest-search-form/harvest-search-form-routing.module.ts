import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HarvestSearchFormPage } from './harvest-search-form.page';

const routes: Routes = [
  {
    path: '',
    component: HarvestSearchFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HarvestSearchFormPageRoutingModule {}
