import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StokPollenViabilityCheckPage } from './stok-pollen-viability-check.page';

const routes: Routes = [
  {
    path: '',
    component: StokPollenViabilityCheckPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StokPollenViabilityCheckPageRoutingModule {}
