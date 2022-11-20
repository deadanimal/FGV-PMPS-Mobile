import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-menu-prompt',
  templateUrl: './menu-prompt.component.html',
  styleUrls: ['./menu-prompt.component.scss'],
})
export class MenuPromptComponent implements OnInit {

  constructor(
    private modalCtrl:ModalController,
    private router:Router,
  ) { }

  ngOnInit() {}

  logOut(){
    this.modalCtrl.dismiss('logOut');
  }

  dashboard(){
    this.modalCtrl.dismiss('dashboard');
  }

}
