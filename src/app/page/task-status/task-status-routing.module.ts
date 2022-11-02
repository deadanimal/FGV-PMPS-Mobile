import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskStatusPage } from './task-status.page';

const routes: Routes = [
  {
    path: '',
    component: TaskStatusPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskStatusPageRoutingModule {}
