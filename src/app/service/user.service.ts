import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  loadingModal:any;
  constructor(
    private http: HttpClient,
    private loadingCtrl: LoadingController,
  ) { }

  async showLoading():Promise<HTMLIonLoadingElement> {
    const loading = await this.loadingCtrl.create();
    loading.present();
    return loading;
  }

  getByRole(
    role:string,
    callback){
    this.loadingModal = this.showLoading();
    this.http.get<[User]>(
      `${environment.baseUrl}${environment.userByRole}${role}`
    ).subscribe(
      async (res:[User]) => {
        this.loadingModal = await this.loadingCtrl.getTop()
        this.loadingModal.dismiss();
        callback(res);
      },
      async (err:HttpErrorResponse) => {
        this.loadingModal = await this.loadingCtrl.getTop()
        this.loadingModal.dismiss();
      }
    );
  }

}
