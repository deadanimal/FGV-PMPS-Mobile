import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StokPollenFormPage } from './stok-pollen-form.page';

const routes: Routes = [
  {
    path: '',
    component: StokPollenFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StokPollenFormPageRoutingModule {}
