import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewTaskInfoPageRoutingModule } from './new-task-info-routing.module';

import { NewTaskInfoPage } from './new-task-info.page';
import { SharedComponentModule } from 'src/app/modules/shared-component/shared-component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewTaskInfoPageRoutingModule,
    SharedComponentModule
  ],
  declarations: [NewTaskInfoPage]
})
export class NewTaskInfoPageModule {}
