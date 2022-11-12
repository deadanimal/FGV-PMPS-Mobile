import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { TandanResponse } from 'src/app/model/tandan-response';
import { environment } from 'src/environments/environment';
import { BaggingTask } from '../../model/bagging-task';
import { TandanService } from './tandan.service';

@Injectable({
  providedIn: 'root'
})
export class BaggingService {

  loadingModal:any;

  constructor(
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private tandanService: TandanService,
  ) {
  }

  async showLoading():Promise<HTMLIonLoadingElement> {
    const loading = await this.loadingCtrl.create();
    loading.present();
    return loading;
  }

  getById(
    userId:String,
    callback
  ){
    this.loadingModal = this.showLoading();
    this.http.get<[BaggingTask]>(
      `${environment.baseUrl}${environment.bagging}` // get all id first
      // `${environment.baseUrl}${environment.bagging}${userId}`
    ).subscribe(
      async (res:[BaggingTask]) => {
        let callbackParam:BaggingTask[] = [];
        res.forEach(el => {
          if(el.id_sv_balut == userId){
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

  getAll(callback){
    this.loadingModal = this.showLoading();
    this.http.get<[BaggingTask]>(
      `${environment.baseUrl}${environment.bagging}`
    ).subscribe(
      async (res:[BaggingTask]) => {
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

  createTask(
    formData:FormData,
    callback
  ){
    this.loadingModal = this.showLoading();
    let tandanForm:FormData = new FormData();
    tandanForm.append('no_daftar',formData.get("no_daftar"));
    tandanForm.append('tarikh_daftar',formData.get("tarikh_daftar"));
    tandanForm.append('pokok_id',formData.get("pokok_id"));
    this.tandanService.create(
      tandanForm,
      (tandanRes:TandanResponse)=>{
        formData.append('tandan_id',tandanRes.id.toString());
        this.http.post<BaggingTask>(
          `${environment.baseUrl}${environment.bagging}`,
          formData
        ).subscribe(
          async (res:BaggingTask) => {
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
    );
  }
}
