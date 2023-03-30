import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StokPollenListPage } from './stok-pollen-list.page';

const routes: Routes = [
  {
    path: '',
    component: StokPollenListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StokPollenListPageRoutingModule {}
