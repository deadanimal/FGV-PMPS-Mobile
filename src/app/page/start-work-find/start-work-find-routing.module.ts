import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StartWorkFindPage } from './start-work-find.page';

const routes: Routes = [
  {
    path: '',
    component: StartWorkFindPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StartWorkFindPageRoutingModule {}
