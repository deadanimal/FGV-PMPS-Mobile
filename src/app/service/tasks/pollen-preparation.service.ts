import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { TandanCycle } from 'src/app/common/tandan-cycle';
import { TaskStatus } from 'src/app/common/task-status';
import { TreeType } from 'src/app/common/tree-type';
import { BaggingModel } from 'src/app/model/bagging';
import { PollenPreparationModel } from 'src/app/model/pollen-preparation-model';
import { TandanResponse } from 'src/app/model/tandan-response';
import { environment } from 'src/environments/environment';
import { BaggingService } from './bagging.service';
import { TandanService } from './tandan.service';

@Injectable({
  providedIn: 'root'
})
export class PollenPreparationService {

  loadingModal:any;
  constructor(
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private tandanService: TandanService,
    private baggingService: BaggingService,
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
    this.http.get<[PollenPreparationModel]>(
      `${environment.baseUrl}${environment.pollen}`
    ).subscribe(
      async (res:[PollenPreparationModel]) => {
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
    ppId:String,
    callback,
    loadingAnim = true,
  ){
    if(loadingAnim){
      this.loadingModal = await this.showLoading();
    }
    this.http.get<PollenPreparationModel>(
      `${environment.baseUrl}${environment.pollen}${ppId}`
    ).subscribe(
      async (res:PollenPreparationModel) => {
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
    formData:FormData,
    callback
  ){
    this.loadingModal = await this.showLoading();
    this.http.post<PollenPreparationModel>(
      `${environment.baseUrl}${environment.pollen}`,
      formData
    ).subscribe(
      async (res:PollenPreparationModel) => {
        this.loadingModal = await this.loadingCtrl.getTop()
        if(this.loadingModal != null){
          this.loadingModal.dismiss();
        }
        this.tandanService.updateCycle(
          res.tandan_id.toString(),
          TandanCycle.pp,
          async (resTandan:TandanResponse)=>{
            callback(res);
          }
        );
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
    ppId:String,
    updateObject:any,
    callback,
  ){
    this.loadingModal = await this.showLoading();
    this.http.put<PollenPreparationModel>(
      `${environment.baseUrl}${environment.pollen}${ppId}`,
      updateObject
    ).subscribe(
      async (res:PollenPreparationModel) => {
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

  async updateVerify(
    ppId:String,
    catatan_pengesah:String,
    status:String,
    callback
  ){
    this.loadingModal = await this.showLoading();
    this.http.put<PollenPreparationModel>(
      `${environment.baseUrl}${environment.pollen}${ppId}`,
      {
        catatan_pengesah:catatan_pengesah,
        status:status,
      }
    ).subscribe(
      async (res:PollenPreparationModel) => {
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

  _alreadyHasPPTask(
    tandan_id:number,
    ppTaskList:PollenPreparationModel[]
  ){
    let retVal = false;
    ppTaskList.forEach(el => {
      if(el.tandan_id == tandan_id){
        retVal = true;
      }
    });
    return retVal;
  }

  getNewTask(callback){
    this.getAll(
      (res2:[PollenPreparationModel])=>{
        this.baggingService.getAll((res:[BaggingModel])=>{
          let retVal:BaggingModel[] = [];
          res.forEach(el => {
            if( el.pokok.jantina == TreeType.Fatherpalm && 
                el.status == TaskStatus.verified &&
                !this._alreadyHasPPTask(el.tandan_id,res2)){
              retVal.push(el);
            }
          });
          callback(retVal);
        });
      }
    );
  }

  async updatePost(
    ppId:String,
    updateObject:any,
    callback,
  ){
    this.loadingModal = await this.showLoading();
    this.http.post<PollenPreparationModel>(
      `${environment.baseUrl}${environment.pollen}${ppId}`,
      updateObject
    ).subscribe(
      async (res:PollenPreparationModel) => {
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
