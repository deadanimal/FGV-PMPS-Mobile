import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HarvestSearchFormPageRoutingModule } from './harvest-search-form-routing.module';

import { HarvestSearchFormPage } from './harvest-search-form.page';
import { SharedComponentModule } from 'src/app/modules/shared-component/shared-component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HarvestSearchFormPageRoutingModule,
    SharedComponentModule
  ],
  declarations: [HarvestSearchFormPage]
})
export class HarvestSearchFormPageModule {}
