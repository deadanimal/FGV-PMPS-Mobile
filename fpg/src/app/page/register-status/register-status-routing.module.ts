import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterStatusPage } from './register-status.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterStatusPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterStatusPageRoutingModule {}
