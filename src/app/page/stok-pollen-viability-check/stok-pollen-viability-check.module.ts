import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StokPollenViabilityCheckPageRoutingModule } from './stok-pollen-viability-check-routing.module';

import { StokPollenViabilityCheckPage } from './stok-pollen-viability-check.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StokPollenViabilityCheckPageRoutingModule
  ],
  declarations: [StokPollenViabilityCheckPage]
})
export class StokPollenViabilityCheckPageModule {}
