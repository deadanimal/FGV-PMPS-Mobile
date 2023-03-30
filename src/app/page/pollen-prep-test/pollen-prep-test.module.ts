import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PollenPrepTestPageRoutingModule } from './pollen-prep-test-routing.module';

import { PollenPrepTestPage } from './pollen-prep-test.page';
import { SharedComponentModule } from 'src/app/modules/shared-component/shared-component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PollenPrepTestPageRoutingModule,
    SharedComponentModule,
  ],
  declarations: [PollenPrepTestPage]
})
export class PollenPrepTestPageModule {}
