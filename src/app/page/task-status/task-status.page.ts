import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Photo } from '@capacitor/camera';
import { LoadingController, ModalController } from '@ionic/angular';
import { GenericTextModalComponent } from 'src/app/component/generic-text-modal/generic-text-modal.component';
import { LoginResponseModel } from 'src/app/model/login-response';
import { TandanResponse } from 'src/app/model/tandan-response';
import { TaskResponseModel } from 'src/app/model/task-response';
import { AccountService, UserRole } from 'src/app/service/account.service';
import { TaskService } from 'src/app/service/task.service';
import { PhotoService } from 'src/app/service/photo.service';
import { environment } from 'src/environments/environment';
import { ModalService } from 'src/app/service/modal.service';
import { UserContinueSelection } from 'src/app/component/continue-prompt/continue-prompt.component';
import { DatePipe } from '@angular/common';

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
  userRole:UserRole;
  viewOnly:boolean = false;
  loadingModal:any;
  serverImage:String;
  taskId:String;
  taskType:String;
  time:String;
  posponedDay:String;

  constructor(
    private photoService:PhotoService,
    private accountService:AccountService,
    private activatedRoute:ActivatedRoute,
    private taskService:TaskService,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private router: Router,
    private modalService: ModalService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit() {
    this.date = this.datePipe.transform(Date.now(),"dd/MM/yyyy");
    this.time = this.datePipe.transform(Date.now(),"HH:mm a");
    this.name = this.accountService.getSessionDetails().nama;
    this.activatedRoute.params.subscribe(params => {
      if(params['taskId']!=null){
        this._getTask(params['taskId']);
        this.taskId = params['taskId'];
      }
      if(params['viewOnly']!=null){
        this.viewOnly = params['viewOnly'];
      }
      if(params['regNumber']!=null){
        this.regNo = params['regNumber'];
      }
      if(params['treeNumber']!=null){
        this.treeId = params['treeNumber'];
      }
      if(params['taskType']!=null){
        this.taskType = params['taskType'].toLowerCase();
      }
    });
    this.userRole = this.accountService.getUserRole();
  }

  async takePicture() {
    this.photo = await this.photoService.addNewToGallery();
  }

  erasePicture(){
    this.photo = null;
  }

  _promptCompleted(){
    this.modalService.successPrompt("Aktiviti anda telah dihantar kepada penyelia").then(
      (value)=>{
        setTimeout(() => {
            this.router.navigateByUrl(
              '/app/tabs/tab1',
              {
                replaceUrl : true
              }
            );
          },500);
      }
    );
  }

  async submitTask(){
    this.loadingModal= await this.showLoading();
    const formData = new FormData();
    const response = await fetch(this.photo.dataUrl);
    const blob = await response.blob();
    formData.append('url_gambar', blob, "task_"+this.taskId+"."+this.photo.format);
    formData.append('catatan_petugas',this.remark.toString());
    formData.append('jenis',this.taskType.toString().toLowerCase());
    formData.append('petugas_id',this.accountService.getSessionDetails().no_kakitangan);
    formData.append('tarikh',this.date.toString());
    formData.append('no_daftar',this.regNo.toString());
    formData.append('pokok_id',this.treeId.toString());
    formData.append('catatan',this.remark.toString());
    this.taskService.createTask(
      formData
    ).subscribe(
      async (res:TaskResponseModel) => {
        this.loadingModal.dismiss();
        if(res!=null){
          this._updateTaskToDone(res);
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

  async _updateTaskToDone(task:TaskResponseModel){
    this.loadingModal= await this.showLoading();
    const formData = new FormData();
    const response = await fetch(this.photo.dataUrl);
    const blob = await response.blob();
    formData.append('url_gambar', blob, "task_"+this.taskId+"."+this.photo.format);
    formData.append('catatan_petugas',this.remark.toString());
    this.taskService.updateTaskToDone(
      task.id.toString(),
      formData
    ).subscribe(
      async (res:TaskResponseModel) => {
        this.loadingModal.dismiss();
        if(res!=null){
          if(this.taskType == 'debung'){
            this._promptCompleted();
          }else{
            this.modalService.continuePrompt().then(
              (value)=>{
                if(value['data'] == UserContinueSelection.no){
                  this._promptCompleted();
                }else{
                  this.router.navigate(
                    [
                      '/app/tabs/tab1/start-work-find',
                      {
                        taskId:this.taskId,
                        treeNum:this.treeId,
                      }
                    ]
                  );
                }
              }
            );
          }
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

  async accept(){
    this.loadingModal= await this.showLoading();
    this.taskService.acceptTask(this.taskId,this.accountService.getSessionDetails().id.toString(),this.svRemark).subscribe(
      (res:TaskResponseModel) => {
        this.loadingModal.dismiss();
        this.router.navigateByUrl(
          '/app/tabs/tab1',
          {
            replaceUrl : true
          }
        );
      },
      (err:HttpErrorResponse) => {
        this.loadingModal.dismiss();
      }
    );
  }

  async reject(){
    this.loadingModal= await this.showLoading();
    this.taskService.rejectTask(
      this.taskId,
      this.accountService.getSessionDetails().id.toString(),
      this.svRemark).subscribe(
        (res:TaskResponseModel) => {
          this.loadingModal.dismiss();
          this.router.navigateByUrl(
            '/app/tabs/tab1',
            {
              replaceUrl : true
            }
          );
        },
        (err:HttpErrorResponse) => {
          this.loadingModal.dismiss();
        }
    );
  }

  pospone(){
    this.modalService.yesNoPrompt("Anjak hari?").then((value)=>{
      let user_selection:UserContinueSelection = value['data'];
      if(user_selection == UserContinueSelection.yes){
        this.modalService.posponePrompt().then((value1)=>{
          this.posponedDay = value1['data'];
          if(this.posponedDay!= null){
            this.modalService.successPrompt("Proses telah berjaya dianjakkan kepada +"+this.posponedDay+" hari").then((value1)=>{
              this.router.navigateByUrl(
                '/app/tabs/tab1',
                {
                  replaceUrl : true
                }
              );
            });
          }
        });
      }else if(user_selection == UserContinueSelection.no){

      }
    });
  }

}
