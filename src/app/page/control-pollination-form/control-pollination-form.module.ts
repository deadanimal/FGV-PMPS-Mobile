import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ControlPollinationFormPageRoutingModule } from './control-pollination-form-routing.module';

import { ControlPollinationFormPage } from './control-pollination-form.page';
import { SharedComponentModule } from 'src/app/modules/shared-component/shared-component.module';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ControlPollinationFormPageRoutingModule,
    SharedComponentModule,
    IonicSelectableModule,
  ],
  declarations: [ControlPollinationFormPage]
})
export class ControlPollinationFormPageModule {}
