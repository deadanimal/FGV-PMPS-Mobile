import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StokPollenViabilityCheckPageRoutingModule } from './stok-pollen-viability-check-routing.module';

import { StokPollenViabilityCheckPage } from './stok-pollen-viability-check.page';
import { SharedComponentModule } from 'src/app/modules/shared-component/shared-component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StokPollenViabilityCheckPageRoutingModule,
    SharedComponentModule,
  ],
  declarations: [StokPollenViabilityCheckPage]
})
export class StokPollenViabilityCheckPageModule {}
