import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HarvestTaskDistributionPageRoutingModule } from './harvest-task-distribution-routing.module';

import { HarvestTaskDistributionPage } from './harvest-task-distribution.page';
import { SharedComponentModule } from 'src/app/modules/shared-component/shared-component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HarvestTaskDistributionPageRoutingModule,
    SharedComponentModule
  ],
  declarations: [HarvestTaskDistributionPage]
})
export class HarvestTaskDistributionPageModule {}
