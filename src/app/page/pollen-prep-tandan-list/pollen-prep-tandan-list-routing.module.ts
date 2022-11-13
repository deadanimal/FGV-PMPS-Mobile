import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PollenPrepTandanListPage } from './pollen-prep-tandan-list.page';

const routes: Routes = [
  {
    path: '',
    component: PollenPrepTandanListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PollenPrepTandanListPageRoutingModule {}
