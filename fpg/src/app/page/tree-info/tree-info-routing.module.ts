import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TreeInfoPage } from './tree-info.page';

const routes: Routes = [
  {
    path: '',
    component: TreeInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TreeInfoPageRoutingModule {}
