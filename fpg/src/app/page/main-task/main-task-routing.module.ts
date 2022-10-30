import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainTaskPage } from './main-task.page';

const routes: Routes = [
  {
    path: '',
    component: MainTaskPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainTaskPageRoutingModule {}
