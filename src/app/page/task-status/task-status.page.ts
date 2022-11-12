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
import { TreeService } from 'src/app/service/tasks/tree.service';
import { PokokResponse } from 'src/app/model/pokok-respons';
import { BaggingService } from 'src/app/service/tasks/bagging.service';
import { BaggingTask } from 'src/app/model/bagging-task';
import { TandanService } from 'src/app/service/tasks/tandan.service';

@Component({
  selector: 'app-task-status',
  templateUrl: './task-status.page.html',
  styleUrls: ['./task-status.page.scss'],
})
export class TaskStatusPage implements OnInit {

  name:String;
  treeId:String;
  treeNum:String;
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
    private treeService: TreeService,
    private tandanService: TandanService,
    private baggingService: BaggingService,
  ) { }

  ngOnInit() {
    this.date = this.datePipe.transform(Date.now(),"dd/MM/yyyy");
    this.time = this.datePipe.transform(Date.now(),"HH:mm a");
    this.name = this.accountService.getSessionDetails().nama;
    this.activatedRoute.params.subscribe(params => {
      if(params['taskId']!=null){
        this.taskId = params['taskId'];
        this._getTask(params['taskId']);
      }
      if(params['viewOnly']!=null){
        this.viewOnly = params['viewOnly'];
      }
      if(params['regNumber']!=null){
        this.regNo = params['regNumber'];
      }
      if(params['treeNumber']!=null){
        this.treeId = params['treeNumber'];
        this._getTreeNumber();
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

  _promptCompleted(title:string = "Aktiviti anda telah dihantar kepada penyelia"){
    this.modalService.successPrompt(title).then(
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
    const formData = new FormData();
    const response = await fetch(this.photo.dataUrl);
    const blob = await response.blob();
    // for tandan
    formData.append('no_daftar',this.regNo.toString());
    formData.append('tarikh_daftar',this.date.toString());
    formData.append('pokok_id',this.treeId.toString());
    formData.append('kitaran',this.taskType.toString());
    // for bagging
    formData.append('url_gambar', blob, "task_"+this.taskId+"."+this.photo.format);
    formData.append('id_sv_balut',this.accountService.getSessionDetails().no_kakitangan);
    formData.append('catatan',this.remark.toString());

    this.baggingService.createTask(formData,async (res:BaggingTask)=>{
      if(res==null){
        const modal= await this.modalCtrl.create({
          component: GenericTextModalComponent,
          componentProps:{
            value:"Failed"
          },
          cssClass:"small-modal",
          backdropDismiss:false,
        });
        modal.present();
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
                    treeNum:this.treeId,
                    taskType:this.taskType,
                  }
                ]
              );
            }
          }
        );
      }
    });
  }

  async _getTask(taskId:String){
    this.baggingService.getById(taskId,(res:BaggingTask)=>{
      this.date = res.created_at.toString();
      this.remark = res.catatan;
      if(res.url_gambar!=null){
        this.serverImage = `${environment.storageUrl}${res.url_gambar}`;
      }
      this._getUserInfo(res.id_sv_balut);
        if(res.tandan_id != null){
          this._getTandanInfo(res.tandan_id.toString());
        }else{
          this.treeId = "-";
          this.regNo = "-";
        }
    });
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
    this.tandanService.getById(tandanId,(res:TandanResponse)=>{
      this.regNo = res.no_daftar;
      this.treeId = res.pokok_id.toString();
      this._getTreeNumber();
    });
  }

  async showLoading():Promise<HTMLIonLoadingElement> {
    const loading = await this.loadingCtrl.create();
    loading.present();
    return loading;
  }

  async accept(){
    this.baggingService.verify(
      this.taskId,
      this.accountService.getSessionDetails().id.toString(),
      this.svRemark+" (TERIMA)",
      (res:BaggingTask)=>{
        this._promptCompleted("Tugasan Telah Berjaya Di Sahkan");
      }
    );
  }

  async reject(){
    this.baggingService.verify(
      this.taskId,
      this.accountService.getSessionDetails().id.toString(),
      this.svRemark+" (TOLAK)",
      (res:BaggingTask)=>{
        this._promptCompleted("Tugasan Telah Berjaya Di Tolak");
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

  _getTreeNumber(){
    this.treeService.getById(this.treeId,(res:PokokResponse)=>{
      this.treeNum = res.no_pokok;
    })
  }

}
