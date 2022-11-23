import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { DefectResponse } from 'src/app/model/defect-response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DefectService {

  loadingModal:any;
  constructor(
    private http: HttpClient,
    private loadingCtrl: LoadingController,
  ) { }

  async showLoading():Promise<HTMLIonLoadingElement> {
    const loading = await this.loadingCtrl.create();
    loading.present();
    return loading;
  }

  getAll(callback,loadingAnim = true){
    if(loadingAnim){
      this.loadingModal = this.showLoading();
    }
    this.http.get<[DefectResponse]>(
      `${environment.baseUrl}${environment.defect}`
    ).subscribe(
      async (res:[DefectResponse]) => {
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
}
