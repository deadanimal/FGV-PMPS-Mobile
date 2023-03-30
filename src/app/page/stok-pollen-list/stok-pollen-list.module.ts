import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StokPollenListPageRoutingModule } from './stok-pollen-list-routing.module';

import { StokPollenListPage } from './stok-pollen-list.page';
import { SharedComponentModule } from 'src/app/modules/shared-component/shared-component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StokPollenListPageRoutingModule,
    SharedComponentModule,
  ],
  declarations: [StokPollenListPage]
})
export class StokPollenListPageModule {}
