import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Photo } from '@capacitor/camera';
import { LoadingController, ModalController } from '@ionic/angular';
import { GenericTextModalComponent } from 'src/app/component/generic-text-modal/generic-text-modal.component';
import { LoginResponseModel } from 'src/app/model/login-response';
import { TandanResponse } from 'src/app/model/tandan-response';
import { TaskResponseModel } from 'src/app/model/task-response';
import { UserPhoto } from 'src/app/model/user-photo';
import { AccountService } from 'src/app/service/account.service';
import { TaskService } from 'src/app/service/task.service';
import { PhotoService } from 'src/app/services/photo.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-task-status',
  templateUrl: './task-status.page.html',
  styleUrls: ['./task-status.page.scss'],
})
export class TaskStatusPage implements OnInit {

  name:String;
  treeId:String;
  regNo:String;
  date:String;
  remark:String;
  svRemark:String;
  photo:Photo;
  userRole:String;
  viewOnly:boolean = false;
  loadingModal:any;
  serverImage:String;
  taskId:String;

  constructor(
    private photoService:PhotoService,
    private accountService:AccountService,
    private activatedRoute:ActivatedRoute,
    private taskService:TaskService,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private router: Router,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if(params['taskId']!=null){
        this._getTask(params['taskId']);
        this.taskId = params['taskId'];
      }
      
      if(params['viewOnly']!=null){
        this.viewOnly = params['viewOnly'];
      }
    });

    let userDetails = this.accountService.getSessionDetails();
    this.userRole = userDetails.peranan;
  }

  async takePicture() {
    this.photo = await this.photoService.addNewToGallery();
  }

  erasePicture(){
    this.photo = null;
  }

  async submitTask(){
    this.loadingModal= await this.showLoading();
    const formData = new FormData();
    const response = await fetch(this.photo.dataUrl);
    const blob = await response.blob();
    formData.append('url_gambar', blob, "task_"+this.taskId+"."+this.photo.format);
    formData.append('catatan_petugas',this.remark.toString());
    this.taskService.updateTaskToDone(
      this.taskId,
      formData
    ).subscribe(
      async (res:TaskResponseModel) => {
        this.loadingModal.dismiss();
        if(res!=null){
          const modal= await this.modalCtrl.create({
            component: GenericTextModalComponent,
            componentProps:{
              value:"Success"
            },
            cssClass:"small-modal",
            backdropDismiss:false,
          });
          modal.present();
          setTimeout(() => {
            modal.dismiss();
            this.router.navigateByUrl(
              '/app/tabs/tab1',
              {
                replaceUrl : true
              }
            );
          },500);
        }else{
          const modal= await this.modalCtrl.create({
            component: GenericTextModalComponent,
            componentProps:{
              value:"Failed"
            },
            cssClass:"small-modal",
            backdropDismiss:false,
          });
          modal.present();
        }
      },
      (err:HttpErrorResponse) => {
        this.loadingModal.dismiss();
      }
    );
  }

  async _getTask(taskId:String){
    this.loadingModal= await this.showLoading();
    this.taskService.getTask(taskId).subscribe(
      (res:TaskResponseModel) => {
        this.loadingModal.dismiss();
        this.date = res.tarikh;
        this.remark = res.catatan_petugas;
        this._getUserInfo(res.petugas_id.toString());
        this._getTandanInfo(res.tandan_id.toString());
        if(res.url_gambar!=null){
          this.serverImage = `${environment.storageUrl}${res.url_gambar}`;
        }
      },
      (err:HttpErrorResponse) => {
        this.loadingModal.dismiss();
      }
    );
  }

  async _getUserInfo(userId:String){
    // this.loadingModal= await this.showLoading();
    this.taskService.getUserById(userId).subscribe(
      (res:LoginResponseModel) => {
        this.loadingModal.dismiss();
        this.name = res.nama;
      },
      (err:HttpErrorResponse) => {
        this.loadingModal.dismiss();
      }
    );
  }

  async _getTandanInfo(tandanId:String){
    // this.loadingModal= await this.showLoading();
    this.taskService.getTandanById(tandanId).subscribe(
      (res:TandanResponse) => {
        this.loadingModal.dismiss();
        this.treeId = res.pokok_id.toString();
        this.regNo = res.no_daftar;
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
