import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage-angular';
import { FormsModule } from '@angular/forms';
import { ManualInputComponent } from './component/manual-input/manual-input.component';
import { DatePipe } from '@angular/common';
import { PosponePromptComponent } from './component/pospone-prompt/pospone-prompt.component';
import { TextBtnPromptComponent } from './component/text-btn-prompt/text-btn-prompt.component';
import { GenericTextModalComponent } from './component/generic-text-modal/generic-text-modal.component';
import { MenuPromptComponent } from './component/menu-prompt/menu-prompt.component';

@NgModule({
  declarations: [
    AppComponent,
    ManualInputComponent,
    PosponePromptComponent,
    TextBtnPromptComponent,
    GenericTextModalComponent,
    MenuPromptComponent,
  ],
  entryComponents: [
    ManualInputComponent,
    PosponePromptComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    FormsModule,
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
