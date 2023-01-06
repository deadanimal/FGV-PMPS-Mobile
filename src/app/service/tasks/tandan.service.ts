import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { DefectModel } from 'src/app/model/defect';
import { PokokResponse } from 'src/app/model/pokok-respons';
import { TandanResponse } from 'src/app/model/tandan-response';
import { environment } from 'src/environments/environment';
import { DefectService } from './defect.service';
import { TreeService } from './tree.service';

@Injectable({
  providedIn: 'root'
})
export class TandanService {

  loadingModal:any;
  constructor(
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private treeService: TreeService,
    private defectService: DefectService,
  ) {
  }

  async showLoading(message = ''):Promise<HTMLIonLoadingElement> {
    const loading = await this.loadingCtrl.create({
      message:message
    });
    let top = await this.loadingCtrl.getTop();
    if(top == null){
      loading.present();
    }
    return loading;
  }

  async getAll(callback,loadingAnim = true,message = ''){
    if(loadingAnim){
      this.loadingModal = await this.showLoading(message);
    }
    this.http.get<[TandanResponse]>(
      `${environment.baseUrl}${environment.tandanInfo}`
    ).subscribe(
      async (res:[TandanResponse]) => {
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

  async getById(
    tandanId:String,
    callback,
    loadingAnim = true
  ){
    if(loadingAnim){
      this.loadingModal = await this.showLoading();
    }
    this.http.get<TandanResponse>(
      `${environment.baseUrl}${environment.tandanInfo}${tandanId}`
    ).subscribe(
      async (res:TandanResponse) => {
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
    this.http.post<TandanResponse>(
      `${environment.baseUrl}${environment.tandanInfo}`,
      formData
    ).subscribe(
      async (res:TandanResponse) => {
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

  async updateCycle(
    tandanId:String,
    kitaran:String,
    callback,
    loadingAnim = true
  ){
    if(loadingAnim){
      this.loadingModal = await this.showLoading();
    }
    this.http.put<TandanResponse>(
      `${environment.baseUrl}${environment.tandanInfo}${tandanId}`,
      {
        kitaran:kitaran,
      }
    ).subscribe(
      async (res:TandanResponse) => {
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

  async updateDefect(
    tandanId:String,
    defect:String,
    callback,
    loadingAnim = true
  ){
    if(loadingAnim){
      this.loadingModal = await this.showLoading();
    }
      this.http.put<TandanResponse>(
        `${environment.baseUrl}${environment.tandanInfo}${tandanId}`,
        {
          status_tandan:"tidak aktif",
          kerosakans_id:defect,
        },
      ).subscribe(
        async (res:TandanResponse) => {
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
    tandanId:String,
    postObject:Object,
    callback,
    loadingAnim = true
  ){
    if(loadingAnim){
      this.loadingModal = await this.showLoading();
    }
      this.http.put<TandanResponse>(
        `${environment.baseUrl}${environment.tandanInfo}${tandanId}`,
        postObject
      ).subscribe(
        async (res:TandanResponse) => {
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

  async updateTreeAndCycle(
    tandanId:String,
    kitaran:String,
    treeId:String,
    tarikh_daftar:String,
    callback,
    loadingAnim = true
  ){
    if(loadingAnim){
      this.loadingModal = await this.showLoading();
    }
    this.http.put<TandanResponse>(
      `${environment.baseUrl}${environment.tandanInfo}${tandanId}`,
      {
        kitaran:kitaran,
        pokok_id:treeId,
        tarikh_daftar:tarikh_daftar,
        status_tandan:"aktif"
      }
    ).subscribe(
      async (res:TandanResponse) => {
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

  _checkIfInTreeArray(treeArray:PokokResponse[],treeId:number){
    let retVal = false;
    treeArray.forEach(el => {
      if(el.id == treeId){
        retVal = true;
      }
    });
    return retVal;
  }

  getByPokokInfo(
    cycle:String,
    block:String,
    progeny:String,
    callback,
  ){
    this.treeService.getAll((res:[PokokResponse])=>{
      let treeArray:PokokResponse[] = [];
      treeArray = res;
      treeArray = this.treeService.filterByBlock(treeArray,block);
      treeArray = this.treeService.filterByProgeny(treeArray,progeny);
      this.getAll(async (res2:[TandanResponse])=>{
        let retArray: TandanResponse[] = [];
        res2.forEach(el => {
          if(this._checkIfInTreeArray(treeArray,el.pokok_id)){
            if(el.kitaran == cycle){
              retArray.push(el);
            }
          }
        });
        callback(retArray);
      });
    });    
  }
}
