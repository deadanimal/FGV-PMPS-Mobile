import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskDistributedPage } from './task-distributed.page';

const routes: Routes = [
  {
    path: '',
    component: TaskDistributedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskDistributedPageRoutingModule {}
