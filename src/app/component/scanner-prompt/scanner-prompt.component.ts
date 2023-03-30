import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-scanner-prompt',
  templateUrl: './scanner-prompt.component.html',
  styleUrls: ['./scanner-prompt.component.scss'],
})
export class ScannerPromptComponent implements OnInit {

  @Input() value:String;

  constructor(
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {}

  dismiss(){
    this.modalCtrl.dismiss();
  }

  btnClick(btnInput:number){
    let userSelection:UserSelection
    if(btnInput == 1){
      userSelection = UserSelection.manual
    }else{
      userSelection = UserSelection.qr_scan
    }
    this.modalCtrl.dismiss(userSelection);
  }
}

export enum UserSelection {
  manual,
  qr_scan
}
