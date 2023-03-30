import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { TaskStatus } from 'src/app/common/task-status';
import { OfflineBaggingResponseModel } from 'src/app/model/offline-bagging-response';
import { QcSearchResponse } from 'src/app/model/qc-search-response';
import { TandanResponse } from 'src/app/model/tandan-response';
import { environment } from 'src/environments/environment';
import { BaggingModel } from '../../model/bagging';
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
    let top = await this.loadingCtrl.getTop();
    if(top == null){
      loading.present();
    }
    return loading;
  }

  async getByUserId(
    userId:number,
    callback,
    loadingAnim = true
  ){
    if(loadingAnim){
      this.loadingModal = await this.showLoading();
    }
    this.http.get<[BaggingModel]>(
      `${environment.baseUrl}${environment.bagging}` // get all id first
      // `${environment.baseUrl}${environment.bagging}${userId}`
    ).subscribe(
      async (res:[BaggingModel]) => {
        let callbackParam:BaggingModel[] = [];
        res.forEach(el => {
          if(el.id_sv_balut == userId){
            callbackParam.push(el);
          }
        });
        if(loadingAnim){
          this.loadingModal = await this.loadingCtrl.getTop()
          if(this.loadingModal != null){
            this.loadingModal.dismiss();
          }
        }
        callback(callbackParam);
      },
      async (err:HttpErrorResponse) => {
        this.loadingModal = await this.loadingCtrl.getTop()
        if(this.loadingModal != null){
          this.loadingModal.dismiss();
        }
      }
    );
  }

  async getAll(callback){
    this.loadingModal = await this.showLoading();
    this.http.get<[BaggingModel]>(
      `${environment.baseUrl}${environment.bagging}`
    ).subscribe(
      async (res:[BaggingModel]) => {
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
    taskId:String,
    callback,
    loadingAnim = true,
  ){
    if(loadingAnim){
      this.loadingModal = await this.showLoading();
    }
    this.http.get<BaggingModel>(
      `${environment.baseUrl}${environment.bagging}${taskId}`
    ).subscribe(
      async (res:BaggingModel) => {
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

  async createTask(
    formData:FormData,
    callback,
    loadingAnim = true,
  ){
    if(loadingAnim){
      this.loadingModal = await this.showLoading();
    }
    formData.append('status',TaskStatus.done);
    this.tandanService.updateTreeAndCycle(
      formData.get("tandan_id").toString(),
      formData.get("kitaran").toString(),
      formData.get("pokok_id").toString(),
      formData.get("tarikh_daftar").toString(),
      (tandanRes:TandanResponse)=>{
        this.http.post<BaggingModel>(
          `${environment.baseUrl}${environment.bagging}`,
          formData
        ).subscribe(
          async (res:BaggingModel) => {
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
    );
  }

  async verify(
    taskId:String,
    userId:number,
    comments:String,
    status:String,
    callback
  ){
    //todo: if status == tolak, update tandan to rejected
    this.loadingModal = await this.showLoading();
    this.http.put<BaggingModel>(
      `${environment.baseUrl}${environment.bagging}${taskId}`,
      {
        pengesah_id:userId,
        catatan_pengesah:comments,
        status:status
      }
    ).subscribe(
      async (res:BaggingModel) => {
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
    taskId:String,
    postData:Object,
    callback,
    loadingAnim = true,
  ){
    if(loadingAnim){
      this.loadingModal = await this.showLoading();
    }
    this.http.put<BaggingModel>(
      `${environment.baseUrl}${environment.bagging}${taskId}`,
      postData
    ).subscribe(
      async (res:BaggingModel) => {
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

  async getFinishedTask(
    userId:number,
    callback,
    loadingAnim = true
  ){
    if(loadingAnim){
      this.loadingModal = await this.showLoading();
    }
    this.getByUserId(userId, async (res:[BaggingModel])=>{
      let retVal:BaggingModel[] = [];
      res.forEach(el => {
        if(el.status == TaskStatus.verified){
          retVal.push(el);
        }
      });
      if(loadingAnim){
        this.loadingModal = await this.loadingCtrl.getTop()
        if(this.loadingModal != null){
          this.loadingModal.dismiss();
        }
      }
      callback(retVal);
    });
  }

  async searchByTreeInfo(
    blok:String,
    progeny:String,
    pembalut:String,
    callback,
    loadingAnim = true
  ){
    if(loadingAnim){
      this.loadingModal = await this.showLoading();
    }
    this.http.post<[QcSearchResponse]>(
      `${environment.baseUrl}${environment.qcSearch}`,
      {
        blok:blok,
        progeny:progeny,
        user_id:pembalut,
      }
    ).subscribe(
      async (res:[QcSearchResponse]) => {
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

  async searchByTreeInfo2(
    blok:String,
    progeny:String,
    pembalut:String,
    callback,
    loadingAnim = true
  ){
    if(loadingAnim){
      this.loadingModal = await this.showLoading();
    }
    this.http.post<[QcSearchResponse]>(
      `${environment.baseUrl}${environment.qcSearch2}`,
      {
        blok:blok,
        progeny:progeny,
        user_id:pembalut,
      }
    ).subscribe(
      async (res:[QcSearchResponse]) => {
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

  async getByTandanId(
    tandanId:number,
    callback,
    loadingAnim = true,
  ){
    if(loadingAnim){
      this.loadingModal = await this.showLoading();
    }
    this.http.get<BaggingModel[]>(
      `${environment.baseUrl}${environment.tandanInfo}${tandanId}/bagging`
    ).subscribe(
      async (res:BaggingModel[]) => {
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

  async OfflineUpload(
    formData:FormData,
    callback,
    loadingAnim = true,
  ){
    if(loadingAnim){
      this.loadingModal = await this.showLoading();
    }
    this.http.post<OfflineBaggingResponseModel>(
      `${environment.baseUrl}${environment.offlineBagging}`,
      formData
    ).subscribe(
      async (res:OfflineBaggingResponseModel) => {
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
}
