import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateNewTaskPage } from './create-new-task.page';

const routes: Routes = [
  {
    path: '',
    component: CreateNewTaskPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateNewTaskPageRoutingModule {}
