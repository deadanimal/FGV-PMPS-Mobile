import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StokPollenFormPageRoutingModule } from './stok-pollen-form-routing.module';

import { StokPollenFormPage } from './stok-pollen-form.page';
import { SharedComponentModule } from 'src/app/modules/shared-component/shared-component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StokPollenFormPageRoutingModule,
    SharedComponentModule,
  ],
  declarations: [StokPollenFormPage]
})
export class StokPollenFormPageModule {}
