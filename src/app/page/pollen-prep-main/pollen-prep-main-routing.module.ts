import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PollenPrepMainPage } from './pollen-prep-main.page';

const routes: Routes = [
  {
    path: '',
    component: PollenPrepMainPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PollenPrepMainPageRoutingModule {}
