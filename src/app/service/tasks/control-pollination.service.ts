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
    loading.present();
    return loading;
  }

  getAll(callback){
    this.loadingModal = this.showLoading();
    this.http.get<[ControlPollinationModel]>(
      `${environment.baseUrl}${environment.crossPolination}`
    ).subscribe(
      async (res:[ControlPollinationModel]) => {
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
    userId:number,
    callback,
    loadingAnim = true
  ){
    if(loadingAnim){
      this.loadingModal = this.showLoading();
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
          this.loadingModal.dismiss();
        }
        callback(callbackParam);
      },
      async (err:HttpErrorResponse) => {
        if(loadingAnim){
          this.loadingModal = await this.loadingCtrl.getTop()
          this.loadingModal.dismiss();
        }
      }
    );
  }

  create(
    formData:FormData,
    status:string,
    callback
  ){
    formData.append('status',status);
    this.loadingModal = this.showLoading();
    this.http.post<ControlPollinationModel>(
      `${environment.baseUrl}${environment.crossPolination}`,
      formData
    ).subscribe(
      async (res:ControlPollinationModel) => {
        this.loadingModal = await this.loadingCtrl.getTop()
        this.loadingModal.dismiss();
        this.tandanService.updateCycle(res.tandan_id.toString(),"debung",async (resTandan:TandanResponse)=>{
          callback(res);
        });
      },
      async (err:HttpErrorResponse) => {
        this.loadingModal = await this.loadingCtrl.getTop()
        this.loadingModal.dismiss();
      }
    );
  }

  getById(
    cpId:String,
    callback,
    loadingAnim = true,
  ){
    if(loadingAnim){
      this.loadingModal = this.showLoading();
    }
    this.http.get<ControlPollinationModel>(
      `${environment.baseUrl}${environment.crossPolination}${cpId}`
    ).subscribe(
      async (res:ControlPollinationModel) => {
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

  update(
    cpId:String,
    formData:FormData,
    callback
  ){
    this.loadingModal = this.showLoading();
    this.http.put<ControlPollinationModel>(
      `${environment.baseUrl}${environment.crossPolination}${cpId}`,
      formData
    ).subscribe(
      async (res:ControlPollinationModel) => {
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

  updatePollenNumber(
    cpId:String,
    noPollen:String,
    percentage:String,
    callback
  ){
    this.loadingModal = this.showLoading();
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
        this.loadingModal.dismiss();
        callback(res);
      },
      async (err:HttpErrorResponse) => {
        this.loadingModal = await this.loadingCtrl.getTop()
        this.loadingModal.dismiss();
      }
    );
  }

  updateAdditionalDaysNumber(
    cpId:String,
    tambahan_hari:String,
    bil_pemeriksaan:String,
    callback
  ){
    this.loadingModal = this.showLoading();
    this.http.put<ControlPollinationModel>(
      `${environment.baseUrl}${environment.crossPolination}${cpId}`,
      {
        tambahan_hari:tambahan_hari,
        bil_pemeriksaan:bil_pemeriksaan,
        status:TaskStatus.postpone,
      }
    ).subscribe(
      async (res:ControlPollinationModel) => {
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

  updateRemarksNumber(
    cpId:String,
    remark:String,
    sv_id:String,
    status:String,
    callback
  ){
    this.loadingModal = this.showLoading();
    this.http.put<ControlPollinationModel>(
      `${environment.baseUrl}${environment.crossPolination}${cpId}`,
      {
        catatan:remark,
        pengesah_id:sv_id,
        status:status,
      }
    ).subscribe(
      async (res:ControlPollinationModel) => {
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

  updateVerify(
    cpId:String,
    tandanId:String,
    pengesah_id:number,
    catatan_pengesah:String,
    status:String,
    callback
  ){
    this.loadingModal = this.showLoading();
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
        this.loadingModal.dismiss();
        callback(res);
      },
      async (err:HttpErrorResponse) => {
        this.loadingModal = await this.loadingCtrl.getTop()
        this.loadingModal.dismiss();
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

  getNewlyCreatedTask(
    userId:number,
    callback,
    loadingAnim = true,
  ){
    if(loadingAnim){
      this.loadingModal = this.showLoading();
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
          this.loadingModal.dismiss();
        }
        callback(tempArray);
      },false);
    },false);
  }
}
