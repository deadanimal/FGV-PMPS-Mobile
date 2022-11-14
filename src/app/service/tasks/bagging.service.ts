import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ControlPollinationTask } from 'src/app/model/control-pollination-task';
import { TandanResponse } from 'src/app/model/tandan-response';
import { environment } from 'src/environments/environment';
import { BaggingTask } from '../../model/bagging-task';
import { ControlPollinationService } from './control-pollination.service';
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
    private controlPollinationService: ControlPollinationService,
  ) {
  }

  async showLoading():Promise<HTMLIonLoadingElement> {
    const loading = await this.loadingCtrl.create();
    loading.present();
    return loading;
  }

  getByUserId(
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

  getById(
    taskId:String,
    callback
  ){
    this.loadingModal = this.showLoading();
    this.http.get<BaggingTask>(
      `${environment.baseUrl}${environment.bagging}${taskId}`
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

  createTask(
    formData:FormData,
    callback
  ){
    this.loadingModal = this.showLoading();
    let tandanForm:FormData = new FormData();
    tandanForm.append('no_daftar',formData.get("no_daftar"));
    tandanForm.append('tarikh_daftar',formData.get("tarikh_daftar"));
    tandanForm.append('pokok_id',formData.get("pokok_id"));
    tandanForm.append('kitaran',formData.get("kitaran"));
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

  verify(
    taskId:String,
    userId:String,
    comments:String,
    callback
  ){
    this.loadingModal = this.showLoading();
    this.http.put<BaggingTask>(
      `${environment.baseUrl}${environment.bagging}${taskId}`,
      {
        pengesah_id:userId,
        catatan_pengesah:comments,
      }
    ).subscribe(
      async (res:BaggingTask) => {
        this.loadingModal = await this.loadingCtrl.getTop()
        this.loadingModal.dismiss();
        let tandanForm:FormData = new FormData();
        tandanForm.append('pokok_id',res.pokok_id.toString());
        tandanForm.append('tandan_id',res.tandan_id.toString());
        tandanForm.append('id_sv_cp',res.id_sv_balut);
        this.controlPollinationService.create(
          tandanForm,
          (res1:ControlPollinationTask)=>{
            callback(res);
          }
        );
      },
      async (err:HttpErrorResponse) => {
        this.loadingModal = await this.loadingCtrl.getTop()
        this.loadingModal.dismiss();
      }
    );
  }
}
