import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PollenPrepMainPageRoutingModule } from './pollen-prep-main-routing.module';

import { PollenPrepMainPage } from './pollen-prep-main.page';
import { SharedComponentModule } from 'src/app/modules/shared-component/shared-component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PollenPrepMainPageRoutingModule,
    SharedComponentModule
  ],
  declarations: [PollenPrepMainPage]
})
export class PollenPrepMainPageModule {}
