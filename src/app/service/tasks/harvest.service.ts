import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { TandanCycle } from 'src/app/common/tandan-cycle';
import { HarvestModel } from 'src/app/model/harvest';
import { OfflineHarvestResponseModel } from 'src/app/model/offline-harvest-response';
import { TandanResponse } from 'src/app/model/tandan-response';
import { User } from 'src/app/model/user';
import { environment } from 'src/environments/environment';
import { UserRole } from '../account.service';
import { UserService } from '../user.service';
import { TandanService } from './tandan.service';

@Injectable({
  providedIn: 'root'
})
export class HarvestService {

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
    this.http.get<[HarvestModel]>(
      `${environment.baseUrl}${environment.harvest}`
    ).subscribe(
      async (res:[HarvestModel]) => {
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
    harvestId:String,
    callback,
    loadingAnim = true,
  ){
    if(loadingAnim){
      this.loadingModal = await this.showLoading();
    }
    this.http.get<HarvestModel>(
      `${environment.baseUrl}${environment.harvest}${harvestId}`
    ).subscribe(
      async (res:HarvestModel) => {
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
    callback,
    loadingAnim = true
  ){
    if(loadingAnim){
      this.loadingModal = await this.showLoading();
    }
    this.http.post<HarvestModel>(
      `${environment.baseUrl}${environment.harvest}`,
      formData
    ).subscribe(
      async (res:HarvestModel) => {
        if(loadingAnim){
          this.loadingModal = await this.loadingCtrl.getTop()
          if(this.loadingModal != null){
            this.loadingModal.dismiss();
          }
        }
        this.tandanService.updateCycle(res.tandan_id.toString(),TandanCycle.harvest,async (resTandan:TandanResponse)=>{
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
    harvestId:String,
    updateObject:any,
    callback,
    loadingAnim = true,
  ){
    if(loadingAnim){
      this.loadingModal = await this.showLoading();
    }
    this.http.post<HarvestModel>(
      `${environment.baseUrl}${environment.harvest}${harvestId}`,
      updateObject
    ).subscribe(
      async (res:HarvestModel) => {
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
    harvestId:String,
    catatan_pengesah:String,
    sv_id:number,
    status:String,
    callback
  ){
    this.loadingModal = await this.showLoading();
    this.http.put<HarvestModel>(
      `${environment.baseUrl}${environment.harvest}${harvestId}`,
      {
        catatan_pengesah:catatan_pengesah,
        pengesah_id:sv_id,
        status:status,
      }
    ).subscribe(
      async (res:HarvestModel) => {
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

  getAllHarvestWorker(callback){
    this.userService.getByRole(UserRole.petugas_tuai,(res:[User])=>{
      callback(res);
    });
  }

  async getByUserId(
    userId:number,
    userBlock:String,
    callback,
    loadingAnim = true
  ){
    if(loadingAnim){
      this.loadingModal = await this.showLoading();
    }
    this.http.get<[HarvestModel]>(
      `${environment.baseUrl}${environment.harvest}` // get all id first
      // `${environment.baseUrl}${environment.bagging}${userId}`
    ).subscribe(
      async (res:[HarvestModel]) => {
        let callbackParam:HarvestModel[] = [];
        res.forEach(el => {
          if(el.id_sv_harvest == userId || (el.id_sv_harvest == null && el.pokok.blok == userBlock)){
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

  async getByTandanId(
    tandanId:number,
    callback,
    loadingAnim = true,
  ){
    if(loadingAnim){
      this.loadingModal = await this.showLoading();
    }
    this.http.get<HarvestModel[]>(
      `${environment.baseUrl}${environment.tandanInfo}${tandanId}/harvest`
    ).subscribe(
      async (res:HarvestModel[]) => {
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
    this.http.post<OfflineHarvestResponseModel>(
      `${environment.baseUrl}${environment.offlineHarvest}`,
      formData
    ).subscribe(
      async (res:OfflineHarvestResponseModel) => {
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
