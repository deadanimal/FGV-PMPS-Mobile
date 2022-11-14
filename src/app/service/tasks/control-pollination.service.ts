import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ControlPollinationTask } from 'src/app/model/control-pollination-task';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ControlPollinationService {

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

  getAll(callback){
    this.loadingModal = this.showLoading();
    this.http.get<[ControlPollinationTask]>(
      `${environment.baseUrl}${environment.crossPolination}`
    ).subscribe(
      async (res:[ControlPollinationTask]) => {
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

  getByUserId(
    userId:String,
    callback
  ){
    this.loadingModal = this.showLoading();
    this.http.get<[ControlPollinationTask]>(
      `${environment.baseUrl}${environment.bagging}` // get all id first
      // `${environment.baseUrl}${environment.bagging}${userId}`
    ).subscribe(
      async (res:[ControlPollinationTask]) => {
        let callbackParam:ControlPollinationTask[] = [];
        res.forEach(el => {
          if(el.id_sv_cp == userId){
            callbackParam.push(el);
          }
        });
        this.loadingModal = await this.loadingCtrl.getTop()
        this.loadingModal.dismiss();
        callback(callbackParam);
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
    this.http.post<ControlPollinationTask>(
      `${environment.baseUrl}${environment.crossPolination}`,
      formData
    ).subscribe(
      async (res:ControlPollinationTask) => {
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
    this.http.get<ControlPollinationTask>(
      `${environment.baseUrl}${environment.crossPolination}${tandanId}`
    ).subscribe(
      async (res:ControlPollinationTask) => {
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
