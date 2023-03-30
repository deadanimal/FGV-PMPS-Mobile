import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { AccountService, UserRole } from 'src/app/service/account.service';

@Component({
  selector: 'app-menu-prompt',
  templateUrl: './menu-prompt.component.html',
  styleUrls: ['./menu-prompt.component.scss'],
})
export class MenuPromptComponent implements OnInit {

  canBack:Boolean;
  showSync = false;

  constructor(
    private modalCtrl:ModalController,
    private accountService:AccountService,
    private router:Router,
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.canBack = false;
    if(this.router.url != '/app/tabs/tab1' && this.router.url != '/app/tabs/tab3'){
      this.canBack = true;
    }

    if( this.accountService.getSessionDetails().peranan == UserRole.petugas_balut ||
      this.accountService.getSessionDetails().peranan == UserRole.petugas_qc ||
      this.accountService.getSessionDetails().peranan == UserRole.petugas_balut_fatherpalm ||
      this.accountService.getSessionDetails().peranan == UserRole.petugas_tuai
      ){
      this.showSync = true;
    }else{
      this.showSync = false;
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
