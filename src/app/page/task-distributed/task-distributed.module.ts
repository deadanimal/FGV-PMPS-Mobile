import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskDistributedPageRoutingModule } from './task-distributed-routing.module';

import { TaskDistributedPage } from './task-distributed.page';
import { SharedComponentModule } from 'src/app/modules/shared-component/shared-component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskDistributedPageRoutingModule,
    SharedComponentModule,
  ],
  declarations: [TaskDistributedPage]
})
export class TaskDistributedPageModule {}
