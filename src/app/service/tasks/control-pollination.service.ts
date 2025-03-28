import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { TaskStatus } from 'src/app/common/task-status';
import { TreeType } from 'src/app/common/tree-type';
import { BaggingModel } from 'src/app/model/bagging';
import { ControlPollinationModel } from 'src/app/model/control-pollination';
import { TandanResponse } from 'src/app/model/tandan-response';
import { environment } from 'src/environments/environment';
import { BaggingService } from './bagging.service';
import { TandanService } from './tandan.service';

@Injectable({
  providedIn: 'root'
})
export class ControlPollinationService {

  loadingModal:any;
  constructor(
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private baggingService: BaggingService,
    private tandanService: TandanService,
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
    this.http.get<[ControlPollinationModel]>(
      `${environment.baseUrl}${environment.crossPolination}`
    ).subscribe(
      async (res:[ControlPollinationModel]) => {
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

  async getByUserId(
    userId:number,
    callback,
    loadingAnim = true
  ){
    if(loadingAnim){
      this.loadingModal = await this.showLoading();
    }
    this.http.get<[ControlPollinationModel]>(
      `${environment.baseUrl}${environment.crossPolination}` // get all id first
      // `${environment.baseUrl}${environment.bagging}${userId}`
    ).subscribe(
      async (res:[ControlPollinationModel]) => {
        let callbackParam:ControlPollinationModel[] = [];
        res.forEach(el => {
          if(el.id_sv_cp == userId){
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
    formData:FormData,
    status:string,
    callback,
    loadingAnim = true
  ){
    formData.append('status',status);
    if(loadingAnim){
      this.loadingModal = await this.showLoading();
    }
    this.http.post<ControlPollinationModel>(
      `${environment.baseUrl}${environment.crossPolination}`,
      formData
    ).subscribe(
      async (res:ControlPollinationModel) => {
        if(loadingAnim){
          this.loadingModal = await this.loadingCtrl.getTop()
          if(this.loadingModal != null){
            this.loadingModal.dismiss();
          }
        }
        this.tandanService.updateCycle(res.tandan_id.toString(),"debung",async (resTandan:TandanResponse)=>{
          callback(res);
        });
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
    cpId:String,
    callback,
    loadingAnim = true,
  ){
    if(loadingAnim){
      this.loadingModal = await this.showLoading();
    }
    this.http.get<ControlPollinationModel>(
      `${environment.baseUrl}${environment.crossPolination}${cpId}`
    ).subscribe(
      async (res:ControlPollinationModel) => {
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

  async update(
    cpId:String,
    formData:Object,
    callback,
    loadingAnim = true,
  ){
    if(loadingAnim){
      this.loadingModal = await this.showLoading();
    }
    this.http.put<ControlPollinationModel>(
      `${environment.baseUrl}${environment.crossPolination}${cpId}`,
      formData
    ).subscribe(
      async (res:ControlPollinationModel) => {
        if(loadingAnim){
          this.loadingModal = await this.loadingCtrl.getTop()
          if(this.loadingModal != null){
            this.loadingModal.dismiss();
          }
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

  async updatePollenNumber(
    cpId:String,
    noPollen:String,
    percentage:String,
    callback
  ){
    this.loadingModal = await this.showLoading();
    this.http.put<ControlPollinationModel>(
      `${environment.baseUrl}${environment.crossPolination}${cpId}`,
      {
        no_pollen:noPollen,
        peratus_pollen:percentage,
        status:TaskStatus.done,
      }
    ).subscribe(
      async (res:ControlPollinationModel) => {
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

  async updateUsingForm(
    cpId:String,
    formData:FormData,
    callback,
    loadingAnim = true
  ){
    if(loadingAnim){
      this.loadingModal = await this.showLoading();
    }
    this.http.post<ControlPollinationModel>(
      `${environment.baseUrl}${environment.crossPolination}${cpId}`,
      formData,
    ).subscribe(
      async (res:ControlPollinationModel) => {
        if(loadingAnim){
          this.loadingModal = await this.loadingCtrl.getTop()
          if(this.loadingModal != null){
            this.loadingModal.dismiss();
          }
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

  async updateVerify(
    cpId:String,
    tandanId:String,
    pengesah_id:number,
    catatan_pengesah:String,
    status:String,
    callback
  ){
    this.loadingModal = await this.showLoading();
    this.http.put<ControlPollinationModel>(
      `${environment.baseUrl}${environment.crossPolination}${cpId}`,
      {
        pengesah_id:pengesah_id,
        catatan_pengesah:catatan_pengesah,
        status:status,
      }
    ).subscribe(
      async (res:ControlPollinationModel) => {
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

  _hasCPTask(tandanId:String,cpTasks:[ControlPollinationModel]){
    let retVal = false;
    cpTasks.forEach(el => {
      if(el.tandan_id.toString() == tandanId){
        retVal = true;
      }
    });
    return retVal;
  }

  async getNewlyCreatedTask(
    userId:number,
    callback,
    loadingAnim = true,
  ){
    if(loadingAnim){
      this.loadingModal = await this.showLoading();
    }
    this.baggingService.getFinishedTask(userId,(res:[BaggingModel])=>{
      let tempArray:BaggingModel[] = [];
      this.getByUserId(userId,async (res1:[ControlPollinationModel])=>{
        res.forEach(el => {
          if(el.pokok?.jantina == TreeType.Motherpalm && !this._hasCPTask(el.tandan_id.toString(),res1)){
            tempArray.push(el);
          }
        });
        if(loadingAnim){
          this.loadingModal = await this.loadingCtrl.getTop()
          if(this.loadingModal != null){
            this.loadingModal.dismiss();
          }
        }
        callback(tempArray);
      },false);
    },false);
  }

  async OfflineUpload(
    formData:FormData,
    callback,
    loadingAnim = true,
  ){
    if(loadingAnim){
      this.loadingModal = await this.showLoading();
    }
    this.http.post<ControlPollinationModel>(
      `${environment.baseUrl}${environment.offlineCp}`,
      formData
    ).subscribe(
      async (res:ControlPollinationModel) => {
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
    this.http.get<ControlPollinationModel[]>(
      `${environment.baseUrl}${environment.tandanInfo}${tandanId}/cp`
    ).subscribe(
      async (res:ControlPollinationModel[]) => {
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
