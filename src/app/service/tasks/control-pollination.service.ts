import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { BaggingTask } from 'src/app/model/bagging-task';
import { ControlPollinationTask } from 'src/app/model/control-pollination-task';
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
    callback,
    loadingAnim = true
  ){
    if(loadingAnim){
      this.loadingModal = this.showLoading();
    }
    this.http.get<[ControlPollinationTask]>(
      `${environment.baseUrl}${environment.crossPolination}` // get all id first
      // `${environment.baseUrl}${environment.bagging}${userId}`
    ).subscribe(
      async (res:[ControlPollinationTask]) => {
        let callbackParam:ControlPollinationTask[] = [];
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
    this.http.get<ControlPollinationTask>(
      `${environment.baseUrl}${environment.crossPolination}${cpId}`
    ).subscribe(
      async (res:ControlPollinationTask) => {
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
    this.http.put<ControlPollinationTask>(
      `${environment.baseUrl}${environment.crossPolination}${cpId}`,
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

  updatePollenNumber(
    cpId:String,
    noPollen:String,
    percentage:String,
    callback
  ){
    this.loadingModal = this.showLoading();
    this.http.put<ControlPollinationTask>(
      `${environment.baseUrl}${environment.crossPolination}${cpId}`,
      {
        no_pollen:noPollen,
        peratus_pollen:percentage,
      }
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

  updateAdditionalDaysNumber(
    cpId:String,
    tambahan_hari:String,
    bil_pemeriksaan:String,
    callback
  ){
    this.loadingModal = this.showLoading();
    this.http.put<ControlPollinationTask>(
      `${environment.baseUrl}${environment.crossPolination}${cpId}`,
      {
        tambahan_hari:tambahan_hari,
        bil_pemeriksaan:bil_pemeriksaan,
      }
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

  updateRemarksNumber(
    cpId:String,
    remark:String,
    callback
  ){
    this.loadingModal = this.showLoading();
    this.http.put<ControlPollinationTask>(
      `${environment.baseUrl}${environment.crossPolination}${cpId}`,
      {
        catatan:remark,
      }
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

  updateVerify(
    cpId:String,
    tandanId:String,
    pengesah_id:String,
    catatan_pengesah:String,
    callback
  ){
    this.loadingModal = this.showLoading();
    this.http.put<ControlPollinationTask>(
      `${environment.baseUrl}${environment.crossPolination}${cpId}`,
      {
        pengesah_id:pengesah_id,
        catatan_pengesah:catatan_pengesah,
      }
    ).subscribe(
      async (res:ControlPollinationTask) => {
        this.loadingModal = await this.loadingCtrl.getTop()
        this.loadingModal.dismiss();
        this.tandanService.updateCycle(res.tandan_id.toString(),"debung",async (resTandan:TandanResponse)=>{
            callback(res);
        },false);
      },
      async (err:HttpErrorResponse) => {
        this.loadingModal = await this.loadingCtrl.getTop()
        this.loadingModal.dismiss();
      }
    );
  }

  _hasCPTask(tandanId:String,cpTasks:[ControlPollinationTask]){
    let retVal = false;
    cpTasks.forEach(el => {
      if(el.tandan_id.toString() == tandanId){
        retVal = true;
      }
    });
    return retVal;
  }

  getNewlyCreatedTask(
    userId:String,
    callback,
    loadingAnim = true,
  ){
    if(loadingAnim){
      this.loadingModal = this.showLoading();
    }
    this.baggingService.getFinishedTask(userId,(res:[BaggingTask])=>{
      let tempArray:BaggingTask[] = [];
      this.getByUserId(userId,async (res1:[ControlPollinationTask])=>{
        res.forEach(el => {
          if(!this._hasCPTask(el.tandan_id.toString(),res1)){
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
