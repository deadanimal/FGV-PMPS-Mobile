import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserInfoHeaderComponent } from 'src/app/component/user-info-header/user-info-header.component';
import { LogoutButtonComponent } from 'src/app/component/logout-button/logout-button.component';
import { OfflineHeaderComponent } from 'src/app/component/offline-header/offline-header.component';



@NgModule({
  declarations: [
    UserInfoHeaderComponent,
    LogoutButtonComponent,
    OfflineHeaderComponent,
  ],
  imports: [
    CommonModule
  ],exports:[
    UserInfoHeaderComponent,
    LogoutButtonComponent,
    OfflineHeaderComponent,
  ]
})
export class SharedComponentModule { }
