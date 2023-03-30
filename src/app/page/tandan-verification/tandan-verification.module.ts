import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TandanVerificationPageRoutingModule } from './tandan-verification-routing.module';

import { TandanVerificationPage } from './tandan-verification.page';
import { SharedComponentModule } from 'src/app/modules/shared-component/shared-component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TandanVerificationPageRoutingModule,
    SharedComponentModule
  ],
  declarations: [TandanVerificationPage]
})
export class TandanVerificationPageModule {}
