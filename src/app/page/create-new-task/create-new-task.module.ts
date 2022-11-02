import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateNewTaskPageRoutingModule } from './create-new-task-routing.module';

import { CreateNewTaskPage } from './create-new-task.page';
import { SharedComponentModule } from 'src/app/modules/shared-component/shared-component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateNewTaskPageRoutingModule,
    SharedComponentModule
  ],
  declarations: [CreateNewTaskPage]
})
export class CreateNewTaskPageModule {}
