import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PollenPrepFormPage } from './pollen-prep-form.page';

const routes: Routes = [
  {
    path: '',
    component: PollenPrepFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PollenPrepFormPageRoutingModule {}
