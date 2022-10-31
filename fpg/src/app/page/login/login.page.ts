import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loadingModal:any;
  resetPass:boolean;
  username:string;
  password:string;

  constructor(
    private loadingCtrl: LoadingController,
    private router :Router,
  ) { }

  ngOnInit() {
  }

  async onLoginBtnClicked(form:NgForm){
    this.loadingModal= await this.showLoading();
    setTimeout(() => {
      this.goToDashboard();
    }, 500);
  }

  goToDashboard(){
    this.loadingModal.dismiss();
    this.router.navigateByUrl(
      '/app/tabs/tab1',
      {
        replaceUrl : true
      }
    );
  }

  async showLoading():Promise<HTMLIonLoadingElement> {
    const loading = await this.loadingCtrl.create();
    loading.present();
    return loading;
  }

}
