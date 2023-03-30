import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QcTaskDistributionPageRoutingModule } from './qc-task-distribution-routing.module';

import { QcTaskDistributionPage } from './qc-task-distribution.page';
import { SharedComponentModule } from 'src/app/modules/shared-component/shared-component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QcTaskDistributionPageRoutingModule,
    SharedComponentModule,
  ],
  declarations: [QcTaskDistributionPage]
})
export class QcTaskDistributionPageModule {}
