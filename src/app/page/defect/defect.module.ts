import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DefectPageRoutingModule } from './defect-routing.module';

import { DefectPage } from './defect.page';
import { SharedComponentModule } from 'src/app/modules/shared-component/shared-component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DefectPageRoutingModule,
    SharedComponentModule
  ],
  declarations: [DefectPage]
})
export class DefectPageModule {}
