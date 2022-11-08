import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-pospone-prompt',
  templateUrl: './pospone-prompt.component.html',
  styleUrls: ['./pospone-prompt.component.scss'],
})
export class PosponePromptComponent implements OnInit {

  numberOfDays:number = 1;
  constructor(
    private modalCtrl:ModalController
  ) { }

  ngOnInit() {}

  add(){
    this.numberOfDays++;
  }

  minus(){
    this.numberOfDays--
  }

  btnClick(){
    this.modalCtrl.dismiss(this.numberOfDays);
  }

}
