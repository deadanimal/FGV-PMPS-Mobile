import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserInfoHeaderComponent } from 'src/app/component/user-info-header/user-info-header.component';
import { LogoutButtonComponent } from 'src/app/component/logout-button/logout-button.component';



@NgModule({
  declarations: [
    UserInfoHeaderComponent,
    LogoutButtonComponent],
  imports: [
    CommonModule
  ],exports:[
    UserInfoHeaderComponent,
    LogoutButtonComponent
  ]
})
export class SharedComponentModule { }
