import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StartWorkFindPageRoutingModule } from './start-work-find-routing.module';

import { StartWorkFindPage } from './start-work-find.page';
import { SharedComponentModule } from 'src/app/modules/shared-component/shared-component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StartWorkFindPageRoutingModule,
    SharedComponentModule
  ],
  declarations: [StartWorkFindPage]
})
export class StartWorkFindPageModule {}
