import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { StokPollenModel } from 'src/app/model/stok-pollen';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PollenUsageService {

  loadingModal:any;
  constructor(
    private http: HttpClient,
    private loadingCtrl: LoadingController,
  ) { }

  async showLoading():Promise<HTMLIonLoadingElement> {
    const loading = await this.loadingCtrl.create();
    let top = await this.loadingCtrl.getTop();
    if(top == null){
      loading.present();
    }
    return loading;
  }

  async getAll(callback){
    this.loadingModal = await this.showLoading();
    this.http.get<[StokPollenModel]>(
      `${environment.baseUrl}${environment.stockPollen}`
    ).subscribe(
      async (res:[StokPollenModel]) => {
        this.loadingModal = await this.loadingCtrl.getTop()
        if(this.loadingModal != null){
          this.loadingModal.dismiss();
        }
        callback(res);
      },
      async (err:HttpErrorResponse) => {
        this.loadingModal = await this.loadingCtrl.getTop()
        if(this.loadingModal != null){
          this.loadingModal.dismiss();
        }
      }
    );
  }

  async getById(
    puId:number,
    callback,
    loadingAnim = true,
  ){
    if(loadingAnim){
      this.loadingModal = await this.showLoading();
    }
    this.http.get<StokPollenModel>(
      `${environment.baseUrl}${environment.stockPollen}${puId}`
    ).subscribe(
      async (res:StokPollenModel) => {
        if(loadingAnim){
          this.loadingModal = await this.loadingCtrl.getTop()
          if(this.loadingModal != null){
            this.loadingModal.dismiss();
          }
        }
        callback(res);
      },
      async (err:HttpErrorResponse) => {
        if(loadingAnim){
          this.loadingModal = await this.loadingCtrl.getTop()
          if(this.loadingModal != null){
            this.loadingModal.dismiss();
          }
        }
      }
    );
  }

  async create(
    data:StokPollenModel,
    callback
  ){
    this.loadingModal = await this.showLoading();
    this.http.post<StokPollenModel>(
      `${environment.baseUrl}${environment.stockPollen}`,
      data
    ).subscribe(
      async (res:StokPollenModel) => {
        this.loadingModal = await this.loadingCtrl.getTop()
        if(this.loadingModal != null){
          this.loadingModal.dismiss();
        }
        callback(res);
      },
      async (err:HttpErrorResponse) => {
        this.loadingModal = await this.loadingCtrl.getTop()
        if(this.loadingModal != null){
          this.loadingModal.dismiss();
        }
      }
    );
  }

  async update(
    puId:number,
    updateObject:any,
    callback,
  ){
    this.loadingModal = await this.showLoading();
    this.http.put<StokPollenModel>(
      `${environment.baseUrl}${environment.stockPollen}${puId}`,
      updateObject
    ).subscribe(
      async (res:StokPollenModel) => {
        this.loadingModal = await this.loadingCtrl.getTop()
        if(this.loadingModal != null){
          this.loadingModal.dismiss();
        }
        callback(res);
      },
      async (err:HttpErrorResponse) => {
        this.loadingModal = await this.loadingCtrl.getTop()
        if(this.loadingModal != null){
          this.loadingModal.dismiss();
        }
      }
    );
  }
}
