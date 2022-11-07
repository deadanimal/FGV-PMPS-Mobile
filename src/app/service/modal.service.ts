import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ContinuePromptComponent } from '../component/continue-prompt/continue-prompt.component';
import { ManualInputComponent } from '../component/manual-input/manual-input.component';
import { ScannerPromptComponent, UserSelection } from '../component/scanner-prompt/scanner-prompt.component';
import { SuccessPromptComponent } from '../component/success-prompt/success-prompt.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(
    private modalCtrl:ModalController
  ) { }

  async qrPrompt(label:string):Promise<UserSelection>{
    let retVal:Promise<any>;
    const modal= await this.modalCtrl.create({
      component: ScannerPromptComponent,
      componentProps:{
        value:label
      },
      cssClass:"small-modal",
      backdropDismiss:true,
    });
    retVal = modal.onDidDismiss();
    await modal.present();
    return retVal;
  }

  async singleInput(label:string):Promise<NgForm>{
    let retVal:Promise<any>;
    const modal= await this.modalCtrl.create({
      component: ManualInputComponent,
      componentProps:{
        label:label
      },
      cssClass:"small-modal",
      backdropDismiss:true,
    });
    retVal = modal.onDidDismiss();
    await modal.present();
    return retVal;
  }

  async continuePrompt():Promise<NgForm>{
    let retVal:Promise<any>;
    const modal= await this.modalCtrl.create({
      component: ContinuePromptComponent,
      cssClass:"small-modal",
      backdropDismiss:true,
    });
    retVal = modal.onDidDismiss();
    await modal.present();
    return retVal;
  }

  async successPrompt(label:string):Promise<NgForm>{
    let retVal:Promise<any>;
    const modal= await this.modalCtrl.create({
      component: SuccessPromptComponent,componentProps:{
        value:label
      },
      cssClass:"small-modal",
      backdropDismiss:true,
    });
    retVal = modal.onDidDismiss();
    await modal.present();
    return retVal;
  }
}
