import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TreeInfoPageRoutingModule } from './tree-info-routing.module';

import { TreeInfoPage } from './tree-info.page';
import { UserInfoHeaderComponent } from 'src/app/component/user-info-header/user-info-header.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TreeInfoPageRoutingModule
  ],
  declarations: [TreeInfoPage,UserInfoHeaderComponent]
})
export class TreeInfoPageModule {}
