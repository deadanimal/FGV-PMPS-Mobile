import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TandanVerificationPage } from './tandan-verification.page';

const routes: Routes = [
  {
    path: '',
    component: TandanVerificationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TandanVerificationPageRoutingModule {}
