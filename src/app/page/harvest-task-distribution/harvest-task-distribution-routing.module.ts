import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HarvestTaskDistributionPage } from './harvest-task-distribution.page';

const routes: Routes = [
  {
    path: '',
    component: HarvestTaskDistributionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HarvestTaskDistributionPageRoutingModule {}
