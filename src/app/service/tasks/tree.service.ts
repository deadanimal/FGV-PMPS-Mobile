import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { PokokResponse } from 'src/app/model/pokok-respons';
import { Pokok } from 'src/app/model/qc-search-response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TreeService {

  loadingModal:HTMLIonLoadingElement;
  constructor(
    private http: HttpClient,
    private loadingCtrl: LoadingController,
  ) { }

  async showLoading(message = ''):Promise<HTMLIonLoadingElement> {
    const loading = await this.loadingCtrl.create(
      {
        message: message,
      }
    );
    let top = await this.loadingCtrl.getTop();
    if(top == null){
      loading.present();
    }
    return loading;
  }

  async getAll(callback,loadingMsg = ''){
    this.loadingModal = await this.showLoading(loadingMsg);
    this.http.get<[PokokResponse]>(
      `${environment.baseUrl}${environment.treeInfo}`
    ).subscribe(
      async (res:[PokokResponse]) => {
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

  filterByProgeny(dataSet:PokokResponse[],progeny:String):PokokResponse[]{
    let retval:PokokResponse[] = [];
    dataSet.forEach(el => {
      if(el.progeny == progeny){
        retval.push(el);
      }
    });
    return retval;
  }

  filterByBlock(dataSet:PokokResponse[],blockName:String):PokokResponse[]{
    let retval:PokokResponse[] = [];
    dataSet.forEach(el => {
      if(el.blok == blockName){
        retval.push(el);
      }
    });
    return retval;
  }

  async getById(
    tandanId:String,
    callback,
    loadingAnim = true,
  ){
    if(loadingAnim){
      this.loadingModal = await this.showLoading();
    }
    this.http.get<PokokResponse>(
      `${environment.baseUrl}${environment.treeInfo}${tandanId}`
    ).subscribe(
      async (res:PokokResponse) => {
        this.loadingModal = await this.loadingCtrl.getTop()
        if(this.loadingModal != null && loadingAnim){
          this.loadingModal.dismiss();
        }
        callback(res);
      },
      async (err:HttpErrorResponse) => {
        this.loadingModal = await this.loadingCtrl.getTop()
        if(this.loadingModal != null && loadingAnim){
          this.loadingModal.dismiss();
        }
      }
    );
  }

  getIdByName(treeName:String,callback){
    let treeInfo = treeName.split('-'); //FPG-22
    this.getAll((res:[PokokResponse])=>{
      let retVal:PokokResponse;
      res.forEach(el => {
        if(el.no_pokok == treeInfo[1] && el.progeny.toLowerCase() == treeInfo[0].toLowerCase()){
          retVal = el;
        }
      });
      callback(retVal);
    });
  }
}
