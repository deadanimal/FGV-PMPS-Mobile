import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-menu-prompt',
  templateUrl: './menu-prompt.component.html',
  styleUrls: ['./menu-prompt.component.scss'],
})
export class MenuPromptComponent implements OnInit {

  constructor(
    private modalCtrl:ModalController,
  ) { }

  ngOnInit() {}

  logOut(){
    console.log("logOut");
    this.modalCtrl.dismiss('logOut');
  }

}
