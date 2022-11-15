import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QcTaskDistributionPage } from './qc-task-distribution.page';

const routes: Routes = [
  {
    path: '',
    component: QcTaskDistributionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QcTaskDistributionPageRoutingModule {}
