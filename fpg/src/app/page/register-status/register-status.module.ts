import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterStatusPageRoutingModule } from './register-status-routing.module';

import { RegisterStatusPage } from './register-status.page';
import { UserInfoHeaderComponent } from 'src/app/component/user-info-header/user-info-header.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterStatusPageRoutingModule
  ],
  declarations: [RegisterStatusPage,UserInfoHeaderComponent]
})
export class RegisterStatusPageModule {}
