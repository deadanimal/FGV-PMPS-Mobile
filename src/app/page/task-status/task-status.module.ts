import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskStatusPageRoutingModule } from './task-status-routing.module';

import { TaskStatusPage } from './task-status.page';
import { SharedComponentModule } from 'src/app/modules/shared-component/shared-component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskStatusPageRoutingModule,
    SharedComponentModule
  ],
  declarations: [TaskStatusPage]
})
export class TaskStatusPageModule {}
