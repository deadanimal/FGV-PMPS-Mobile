import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QcSearchFormPage } from './qc-search-form.page';

const routes: Routes = [
  {
    path: '',
    component: QcSearchFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QcSearchFormPageRoutingModule {}
