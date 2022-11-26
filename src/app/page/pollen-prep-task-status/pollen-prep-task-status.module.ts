import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PollenPrepTaskStatusPageRoutingModule } from './pollen-prep-task-status-routing.module';

import { PollenPrepTaskStatusPage } from './pollen-prep-task-status.page';
import { SharedComponentModule } from 'src/app/modules/shared-component/shared-component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PollenPrepTaskStatusPageRoutingModule,
    SharedComponentModule
  ],
  declarations: [PollenPrepTaskStatusPage]
})
export class PollenPrepTaskStatusPageModule {}
