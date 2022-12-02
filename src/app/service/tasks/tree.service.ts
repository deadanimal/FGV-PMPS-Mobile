import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { PokokResponse } from 'src/app/model/pokok-respons';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TreeService {

  loadingModal:any;
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
    loading.present();
    return loading;
  }

  getAll(callback,loadingMsg = ''){
    this.loadingModal = this.showLoading(loadingMsg);
    this.http.get<[PokokResponse]>(
      `${environment.baseUrl}${environment.treeInfo}`
    ).subscribe(
      async (res:[PokokResponse]) => {
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

  getById(
    tandanId:String,
    callback
  ){
    this.loadingModal = this.showLoading();
    this.http.get<PokokResponse>(
      `${environment.baseUrl}${environment.treeInfo}${tandanId}`
    ).subscribe(
      async (res:PokokResponse) => {
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
