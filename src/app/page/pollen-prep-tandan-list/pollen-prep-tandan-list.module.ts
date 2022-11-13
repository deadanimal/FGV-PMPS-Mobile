import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PollenPrepTandanListPageRoutingModule } from './pollen-prep-tandan-list-routing.module';

import { PollenPrepTandanListPage } from './pollen-prep-tandan-list.page';
import { SharedComponentModule } from 'src/app/modules/shared-component/shared-component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PollenPrepTandanListPageRoutingModule,
    SharedComponentModule,
  ],
  declarations: [PollenPrepTandanListPage]
})
export class PollenPrepTandanListPageModule {}
