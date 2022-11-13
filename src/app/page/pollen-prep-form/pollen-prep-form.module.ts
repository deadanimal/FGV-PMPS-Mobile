import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PollenPrepFormPageRoutingModule } from './pollen-prep-form-routing.module';

import { PollenPrepFormPage } from './pollen-prep-form.page';
import { SharedComponentModule } from 'src/app/modules/shared-component/shared-component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PollenPrepFormPageRoutingModule,
    SharedComponentModule,
  ],
  declarations: [PollenPrepFormPage]
})
export class PollenPrepFormPageModule {}
