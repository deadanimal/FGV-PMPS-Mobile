import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefectPage } from './defect.page';

const routes: Routes = [
  {
    path: '',
    component: DefectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DefectPageRoutingModule {}
