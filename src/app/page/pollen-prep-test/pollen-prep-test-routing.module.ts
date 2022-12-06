import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PollenPrepTestPage } from './pollen-prep-test.page';

const routes: Routes = [
  {
    path: '',
    component: PollenPrepTestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PollenPrepTestPageRoutingModule {}
