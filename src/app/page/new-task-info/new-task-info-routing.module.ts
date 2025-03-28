import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewTaskInfoPage } from './new-task-info.page';

const routes: Routes = [
  {
    path: '',
    component: NewTaskInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewTaskInfoPageRoutingModule {}
