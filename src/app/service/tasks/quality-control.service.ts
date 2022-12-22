import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { TandanCycle } from 'src/app/common/tandan-cycle';
import { QualityControlModel } from 'src/app/model/quality-control';
import { TandanResponse } from 'src/app/model/tandan-response';
import { User } from 'src/app/model/user';
import { environment } from 'src/environments/environment';
import { UserRole } from '../account.service';
import { UserService } from '../user.service';
import { TandanService } from './tandan.service';

@Injectable({
  providedIn: 'root'
})
export class QualityControlService {

  loadingModal:any;
  constructor(
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private tandanService: TandanService,
    private userService: UserService,
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
    this.http.get<[QualityControlModel]>(
      `${environment.baseUrl}${environment.qualityControl}`
    ).subscribe(
      async (res:[QualityControlModel]) => {
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
    this.http.get<[QualityControlModel]>(
      `${environment.baseUrl}${environment.qualityControl}` // get all id first
      // `${environment.baseUrl}${environment.bagging}${userId}`
    ).subscribe(
      async (res:[QualityControlModel]) => {
        let callbackParam:QualityControlModel[] = [];
        res.forEach(el => {
          if(el.id_sv_qc == userId){
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

  async getById(
    qcId:String,
    callback,
    loadingAnim = true,
  ){
    if(loadingAnim){
      this.loadingModal = await this.showLoading();
    }
    this.http.get<QualityControlModel>(
      `${environment.baseUrl}${environment.qualityControl}${qcId}`
    ).subscribe(
      async (res:QualityControlModel) => {
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
    this.http.post<QualityControlModel>(
      `${environment.baseUrl}${environment.qualityControl}`,
      formData
    ).subscribe(
      async (res:QualityControlModel) => {
        this.loadingModal = await this.loadingCtrl.getTop()
        if(this.loadingModal != null){
          this.loadingModal.dismiss();
        }
        this.tandanService.updateCycle(res.tandan_id.toString(),TandanCycle.qc,async (resTandan:TandanResponse)=>{
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

  async update(
    qcId:String,
    updateObject:any,
    callback,
  ){
    this.loadingModal = await this.showLoading();
    this.http.post<QualityControlModel>(
      `${environment.baseUrl}${environment.qualityControl}${qcId}`,
      updateObject
    ).subscribe(
      async (res:QualityControlModel) => {
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
    qcId:String,
    catatan_pengesah:String,
    status:String,
    callback
  ){
    this.loadingModal = await this.showLoading();
    this.http.put<QualityControlModel>(
      `${environment.baseUrl}${environment.qualityControl}${qcId}`,
      {
        catatan_pengesah:catatan_pengesah,
        status:status,
      }
    ).subscribe(
      async (res:QualityControlModel) => {
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

  getAllQcWorker(callback){
    this.userService.getByRole(UserRole.petugas_qc,(res:[User])=>{
      callback(res);
    });
  }
}
