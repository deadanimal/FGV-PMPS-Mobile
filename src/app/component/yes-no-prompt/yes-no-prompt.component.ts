import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserContinueSelection } from '../continue-prompt/continue-prompt.component';

@Component({
  selector: 'app-yes-no-prompt',
  templateUrl: './yes-no-prompt.component.html',
  styleUrls: ['./yes-no-prompt.component.scss'],
})
export class YesNoPromptComponent implements OnInit {

  @Input() label:String;
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
