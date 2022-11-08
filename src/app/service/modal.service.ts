import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ContinuePromptComponent, UserContinueSelection } from '../component/continue-prompt/continue-prompt.component';
import { ManualInputComponent } from '../component/manual-input/manual-input.component';
import { PosponePromptComponent } from '../component/pospone-prompt/pospone-prompt.component';
import { ScannerPromptComponent, UserSelection } from '../component/scanner-prompt/scanner-prompt.component';
import { SuccessPromptComponent } from '../component/success-prompt/success-prompt.component';
import { TextBtnPromptComponent } from '../component/text-btn-prompt/text-btn-prompt.component';
import { YesNoPromptComponent } from '../component/yes-no-prompt/yes-no-prompt.component';

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

  async continuePrompt():Promise<UserContinueSelection>{
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

  async successPrompt(label:string):Promise<any>{
    let retVal:Promise<any>;
    const modal= await this.modalCtrl.create({
      component: SuccessPromptComponent,
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

  async yesNoPrompt(label:string):Promise<UserContinueSelection>{
    let retVal:Promise<any>;
    const modal= await this.modalCtrl.create({
      component: YesNoPromptComponent,
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

  async posponePrompt():Promise<number>{
    let retVal:Promise<any>;
    const modal= await this.modalCtrl.create({
      component: PosponePromptComponent,
      cssClass:"small-modal",
      backdropDismiss:true,
    });
    retVal = modal.onDidDismiss();
    await modal.present();
    return retVal;
  }

  async textAndBtnPrompt(text:string,btn:string):Promise<UserContinueSelection>{
    let retVal:Promise<any>;
    const modal= await this.modalCtrl.create({
      component: TextBtnPromptComponent,
      componentProps:{
        text:text,
        button:btn,
      },
      cssClass:"small-modal",
      backdropDismiss:true,
    });
    retVal = modal.onDidDismiss();
    await modal.present();
    return retVal;
  }
}
