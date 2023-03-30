import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserSelection } from '../scanner-prompt/scanner-prompt.component';

@Component({
  selector: 'app-continue-prompt',
  templateUrl: './continue-prompt.component.html',
  styleUrls: ['./continue-prompt.component.scss'],
})
export class ContinuePromptComponent implements OnInit {

  constructor(
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {}

  btnClick(btnInput:number){
    let userSelection:UserContinueSelection
    if(btnInput == 1){
      userSelection = UserContinueSelection.no
    }else{
      userSelection = UserContinueSelection.yes
    }
    this.modalCtrl.dismiss(userSelection);
  }

}

export enum UserContinueSelection {
  yes,
  no
}
