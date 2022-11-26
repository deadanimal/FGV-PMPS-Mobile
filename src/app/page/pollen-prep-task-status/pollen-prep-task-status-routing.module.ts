import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PollenPrepTaskStatusPage } from './pollen-prep-task-status.page';

const routes: Routes = [
  {
    path: '',
    component: PollenPrepTaskStatusPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PollenPrepTaskStatusPageRoutingModule {}
