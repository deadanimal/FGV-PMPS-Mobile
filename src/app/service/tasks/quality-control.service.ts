import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { QualityControlTask } from 'src/app/model/quality-control-task';
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
    loading.present();
    return loading;
  }

  getAll(callback){
    this.loadingModal = this.showLoading();
    this.http.get<[QualityControlTask]>(
      `${environment.baseUrl}${environment.qualityControl}`
    ).subscribe(
      async (res:[QualityControlTask]) => {
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
    this.http.get<[QualityControlTask]>(
      `${environment.baseUrl}${environment.qualityControl}` // get all id first
      // `${environment.baseUrl}${environment.bagging}${userId}`
    ).subscribe(
      async (res:[QualityControlTask]) => {
        let callbackParam:QualityControlTask[] = [];
        res.forEach(el => {
          if(el.id_sv_qc == userId){
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

  getById(
    qcId:String,
    callback,
    loadingAnim = true,
  ){
    if(loadingAnim){
      this.loadingModal = this.showLoading();
    }
    this.http.get<QualityControlTask>(
      `${environment.baseUrl}${environment.qualityControl}${qcId}`
    ).subscribe(
      async (res:QualityControlTask) => {
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

  create(
    formData:FormData,
    callback
  ){
    this.loadingModal = this.showLoading();
    this.http.post<QualityControlTask>(
      `${environment.baseUrl}${environment.qualityControl}`,
      formData
    ).subscribe(
      async (res:QualityControlTask) => {
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

  update(
    qcId:String,
    updateObject:any,
    callback,
  ){
    this.loadingModal = this.showLoading();
    this.http.put<QualityControlTask>(
      `${environment.baseUrl}${environment.qualityControl}${qcId}`,
      updateObject
    ).subscribe(
      async (res:QualityControlTask) => {
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
    qcId:String,
    pengesah_id:String,
    catatan_pengesah:String,
    callback
  ){
    this.loadingModal = this.showLoading();
    this.http.put<QualityControlTask>(
      `${environment.baseUrl}${environment.qualityControl}${qcId}`,
      {
        pengesah_id:pengesah_id,
        catatan_pengesah:catatan_pengesah,
      }
    ).subscribe(
      async (res:QualityControlTask) => {
        this.loadingModal = await this.loadingCtrl.getTop()
        this.loadingModal.dismiss();
        this.tandanService.updateCycle(res.tandan_id.toString(),"qc",async (resTandan:TandanResponse)=>{
          callback(res);
        },false);
      },
      async (err:HttpErrorResponse) => {
        this.loadingModal = await this.loadingCtrl.getTop()
        this.loadingModal.dismiss();
      }
    );
  }

  getAllQcWorker(callback){
    this.userService.getByRole(UserRole.petugas_qa,(res:[User])=>{
      callback(res);
    });
  }
}
