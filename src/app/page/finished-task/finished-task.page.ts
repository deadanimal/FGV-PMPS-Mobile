import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { TandanResponse } from 'src/app/model/tandan-response';
import { TaskService } from 'src/app/service/task.service';

@Component({
  selector: 'app-finished-task',
  templateUrl: './finished-task.page.html',
  styleUrls: ['./finished-task.page.scss'],
})
export class FinishedTaskPage implements OnInit {

  treeNumber:String;
  regNo:String;
  cycle:String;
  status:String;
  age:String;
  loadingModal:any;
  constructor(
    private activatedRoute:ActivatedRoute,
    private taskService:TaskService,
    private loadingCtrl: LoadingController,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if(params['tandanId']!=null){
        this._getTandanInfo(params['tandanId']);
      }
    });
  }

  async _getTandanInfo(tandanId:String){
    this.loadingModal= await this.showLoading();
    this.taskService.getTandanById(tandanId).subscribe(
      (res:TandanResponse) => {
        this.loadingModal.dismiss();
        if(res!=null){
          this.treeNumber = res.pokok_id.toString();
          this.regNo = res.no_daftar;
          this.age = res.umur.toString();
          this.cycle = res.kitaran;
          this.status = res.status_tandan;
        }
      },
      (err:HttpErrorResponse) => {
        this.loadingModal.dismiss();
      }
    );
  }

  async showLoading():Promise<HTMLIonLoadingElement> {
    const loading = await this.loadingCtrl.create();
    loading.present();
    return loading;
  }

}
