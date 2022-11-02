import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TreeInfoPageRoutingModule } from './tree-info-routing.module';

import { TreeInfoPage } from './tree-info.page';
import { SharedComponentModule } from 'src/app/modules/shared-component/shared-component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TreeInfoPageRoutingModule,
    SharedComponentModule
  ],
  declarations: [TreeInfoPage]
})
export class TreeInfoPageModule {}
