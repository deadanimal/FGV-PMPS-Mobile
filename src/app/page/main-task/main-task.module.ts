import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainTaskPageRoutingModule } from './main-task-routing.module';

import { MainTaskPage } from './main-task.page';
import { SharedComponentModule } from 'src/app/modules/shared-component/shared-component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainTaskPageRoutingModule,
    SharedComponentModule
  ],
  declarations: [MainTaskPage]
})
export class MainTaskPageModule {}
