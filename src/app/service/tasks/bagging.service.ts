import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { TaskStatus } from 'src/app/common/task-status';
import { QcSearchResponse } from 'src/app/model/qc-search-response';
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
    callback,
    loadingAnim = true,
  ){
    if(loadingAnim){
      this.loadingModal = this.showLoading();
    }
    this.http.get<BaggingTask>(
      `${environment.baseUrl}${environment.bagging}${taskId}`
    ).subscribe(
      async (res:BaggingTask) => {
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

  createTask(
    formData:FormData,
    callback
  ){
    this.loadingModal = this.showLoading();
    formData.append('status',TaskStatus.done);
    this.tandanService.updateTreeAndCycle(
      formData.get("tandan_id").toString(),
      formData.get("kitaran").toString(),
      formData.get("pokok_id").toString(),
      formData.get("tarikh_daftar").toString(),
      (tandanRes:TandanResponse)=>{
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
    status:String,
    callback
  ){
    //todo: if status == tolak, update tandan to rejected
    this.loadingModal = this.showLoading();
    this.http.put<BaggingTask>(
      `${environment.baseUrl}${environment.bagging}${taskId}`,
      {
        pengesah_id:userId,
        catatan_pengesah:comments,
        status:status
      }
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

  getFinishedTask(
    userId:String,
    callback,
    loadingAnim = true
  ){
    if(loadingAnim){
      this.loadingModal = this.showLoading();
    }
    this.getByUserId(userId, async (res:[BaggingTask])=>{
      let retVal:BaggingTask[] = [];
      res.forEach(el => {
        if(el.status == TaskStatus.verified){
          retVal.push(el);
        }
      });
      if(loadingAnim){
        this.loadingModal = await this.loadingCtrl.getTop()
        this.loadingModal.dismiss();
      }
      callback(retVal);
    });
  }

  searchByTreeInfo(
    blok:String,
    progeny:String,
    pembalut:String,
    callback,
    loadingAnim = true
  ){
    if(loadingAnim){
      this.loadingModal = this.showLoading();
    }
    this.http.post<[QcSearchResponse]>(
      `${environment.baseUrl}${environment.qcSearch}`,
      {
        blok:blok,
        progeny:progeny,
        pembalut:pembalut,
      }
    ).subscribe(
      async (res:[QcSearchResponse]) => {
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
