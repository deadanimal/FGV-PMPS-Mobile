import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainTaskPageRoutingModule } from './main-task-routing.module';

import { MainTaskPage } from './main-task.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainTaskPageRoutingModule
  ],
  declarations: [MainTaskPage]
})
export class MainTaskPageModule {}
