import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { TandanResponse } from 'src/app/model/tandan-response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TandanService {

  loadingModal:any;
  constructor(
    private http: HttpClient,
    private loadingCtrl: LoadingController,
  ) {
  }

  async showLoading():Promise<HTMLIonLoadingElement> {
    const loading = await this.loadingCtrl.create();
    loading.present();
    return loading;
  }

  getAll(callback){
    this.loadingModal = this.showLoading();
    this.http.get<[TandanResponse]>(
      `${environment.baseUrl}${environment.tandanInfo}`
    ).subscribe(
      async (res:[TandanResponse]) => {
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

  getById(
    tandanId:String,
    callback
  ){
    this.loadingModal = this.showLoading();
    this.http.get<TandanResponse>(
      `${environment.baseUrl}${environment.tandanInfo}${tandanId}`
    ).subscribe(
      async (res:TandanResponse) => {
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

  create(
    formData:FormData,
    callback
  ){
    this.loadingModal = this.showLoading();
    this.http.post<TandanResponse>(
      `${environment.baseUrl}${environment.tandanInfo}`,
      formData
    ).subscribe(
      async (res:TandanResponse) => {
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

  updateCycle(
    tandanId:String,
    kitaran:String,
    callback,
    loadingAnim = true
  ){
    if(loadingAnim){
      this.loadingModal = this.showLoading();
    }
    this.http.put<TandanResponse>(
      `${environment.baseUrl}${environment.tandanInfo}${tandanId}`,
      {
        kitaran:kitaran,
      }
    ).subscribe(
      async (res:TandanResponse) => {
        if(loadingAnim){
          this.loadingModal = await this.loadingCtrl.getTop()
          this.loadingModal.dismiss();
        }
        callback(res);
      },
      async (err:HttpErrorResponse) => {
        if(loadingAnim){
          this.loadingModal = await this.loadingCtrl.getTop()
          this.loadingModal.dismiss();
        }
      }
    );
  }
}
