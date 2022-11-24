import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { TandanCycle } from 'src/app/common/tandan-cycle';
import { PollenPreparationModel } from 'src/app/model/pollen-preparation-model';
import { TandanResponse } from 'src/app/model/tandan-response';
import { environment } from 'src/environments/environment';
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
  ) { }

  async showLoading():Promise<HTMLIonLoadingElement> {
    const loading = await this.loadingCtrl.create();
    loading.present();
    return loading;
  }

  getAll(callback){
    this.loadingModal = this.showLoading();
    this.http.get<[PollenPreparationModel]>(
      `${environment.baseUrl}${environment.pollen}`
    ).subscribe(
      async (res:[PollenPreparationModel]) => {
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
    ppId:String,
    callback,
    loadingAnim = true,
  ){
    if(loadingAnim){
      this.loadingModal = this.showLoading();
    }
    this.http.get<PollenPreparationModel>(
      `${environment.baseUrl}${environment.pollen}${ppId}`
    ).subscribe(
      async (res:PollenPreparationModel) => {
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
    this.http.post<PollenPreparationModel>(
      `${environment.baseUrl}${environment.pollen}`,
      formData
    ).subscribe(
      async (res:PollenPreparationModel) => {
        this.loadingModal = await this.loadingCtrl.getTop()
        this.loadingModal.dismiss();
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
        this.loadingModal.dismiss();
      }
    );
  }

  update(
    ppId:String,
    updateObject:any,
    callback,
  ){
    this.loadingModal = this.showLoading();
    this.http.put<PollenPreparationModel>(
      `${environment.baseUrl}${environment.pollen}${ppId}`,
      updateObject
    ).subscribe(
      async (res:PollenPreparationModel) => {
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
    ppId:String,
    catatan_pengesah:String,
    status:String,
    callback
  ){
    this.loadingModal = this.showLoading();
    this.http.put<PollenPreparationModel>(
      `${environment.baseUrl}${environment.pollen}${ppId}`,
      {
        catatan_pengesah:catatan_pengesah,
        status:status,
      }
    ).subscribe(
      async (res:PollenPreparationModel) => {
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
}
