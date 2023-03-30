import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QcSearchFormPageRoutingModule } from './qc-search-form-routing.module';

import { QcSearchFormPage } from './qc-search-form.page';
import { SharedComponentModule } from 'src/app/modules/shared-component/shared-component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QcSearchFormPageRoutingModule,
    SharedComponentModule,
  ],
  declarations: [QcSearchFormPage]
})
export class QcSearchFormPageModule {}
