import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-text-btn-prompt',
  templateUrl: './text-btn-prompt.component.html',
  styleUrls: ['./text-btn-prompt.component.scss'],
})
export class TextBtnPromptComponent implements OnInit {

  @Input() text:String;
  @Input() button:String;
  constructor(
    private modalCtrl:ModalController
  ) { }

  ngOnInit() {}

  dismiss(){
    this.modalCtrl.dismiss();
  }

}
