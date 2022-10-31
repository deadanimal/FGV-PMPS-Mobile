import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserInfoHeaderComponent } from 'src/app/component/user-info-header/user-info-header.component';



@NgModule({
  declarations: [UserInfoHeaderComponent],
  imports: [
    CommonModule
  ],exports:[
    UserInfoHeaderComponent
  ]
})
export class SharedComponentModule { }
