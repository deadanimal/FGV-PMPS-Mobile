import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-menu-prompt',
  templateUrl: './menu-prompt.component.html',
  styleUrls: ['./menu-prompt.component.scss'],
})
export class MenuPromptComponent implements OnInit {

  canBack:Boolean;

  constructor(
    private modalCtrl:ModalController,
    private router:Router,
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.canBack = false;
    if(this.router.url != '/app/tabs/tab1' && this.router.url != '/app/tabs/tab3'){
      this.canBack = true;
    }
  }

  back(){
    this.modalCtrl.dismiss('back');
  }

  logOut(){
    this.modalCtrl.dismiss('logOut');
  }

  dashboard(){
    this.modalCtrl.dismiss('dashboard');
  }

  exit(){
    this.modalCtrl.dismiss('exit');
  }

  sync(){
    this.modalCtrl.dismiss('sync');
  }

}
