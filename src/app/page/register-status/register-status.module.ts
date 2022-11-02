import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterStatusPageRoutingModule } from './register-status-routing.module';

import { RegisterStatusPage } from './register-status.page';
import { SharedComponentModule } from 'src/app/modules/shared-component/shared-component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterStatusPageRoutingModule,
    SharedComponentModule
  ],
  declarations: [RegisterStatusPage]
})
export class RegisterStatusPageModule {}
