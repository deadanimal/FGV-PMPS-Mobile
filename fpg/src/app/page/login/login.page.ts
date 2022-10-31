import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { GenericTextModalComponent } from 'src/app/component/generic-text-modal/generic-text-modal.component';
import { LoginResponseModel } from 'src/app/model/login-response';
import { AccountService } from 'src/app/service/account.service';
import { StorageService } from 'src/app/service/storage.service';

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
    private accountService:AccountService,
    private modalCtrl: ModalController,
    private storageService: StorageService,
  ) { }

  ngOnInit() {
  }

  async onLoginBtnClicked(form:NgForm){
    this.loadingModal= await this.showLoading();
    this.accountService.login(
      form.value.username,
      form.value.password
    ).subscribe(
      (res:LoginResponseModel) => {
        this.loadingModal.dismiss();
        if(res.id != null){
          this.storageService.set(this.storageService.loginDetail,res);
          this.accountService.saveAsSessionDetails(res);
          this.showModal("Success", true );
        }else{
          this.showModal("User tidak dijumpai", false );
        }
      },
      (err:HttpErrorResponse) => {
        this.showModal("Error", false);
        this.loadingModal.dismiss();
      }
    );
  }

  async showModal(text:string, success:boolean) {
    const modal= await this.modalCtrl.create({
      component: GenericTextModalComponent,
      componentProps:{
        value:text
      },
      cssClass:"small-modal",
      backdropDismiss:false,
    });
    modal.present();
    if(success){
      this.loadingModal.present();
      setTimeout(() => {
        modal.dismiss();
        this.goToDashboard();
      },500);
    }
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
