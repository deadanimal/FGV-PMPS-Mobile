import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OfflineModePageRoutingModule } from './offline-mode-routing.module';

import { OfflineModePage } from './offline-mode.page';
import { SharedComponentModule } from 'src/app/modules/shared-component/shared-component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfflineModePageRoutingModule,
    SharedComponentModule
  ],
  declarations: [OfflineModePage]
})
export class OfflineModePageModule {}
