import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FinishedTaskPageRoutingModule } from './finished-task-routing.module';

import { FinishedTaskPage } from './finished-task.page';
import { SharedComponentModule } from 'src/app/modules/shared-component/shared-component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FinishedTaskPageRoutingModule,
    SharedComponentModule
  ],
  declarations: [FinishedTaskPage]
})
export class FinishedTaskPageModule {}
