import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Photo } from '@capacitor/camera';
import { IonSelect, LoadingController, ModalController } from '@ionic/angular';
import { GenericTextModalComponent } from 'src/app/component/generic-text-modal/generic-text-modal.component';
import { LoginResponseModel } from 'src/app/model/login-response';
import { TandanResponse } from 'src/app/model/tandan-response';
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
import { BaggingModel } from 'src/app/model/bagging';
import { TandanService } from 'src/app/service/tasks/tandan.service';
import { ControlPollinationService } from 'src/app/service/tasks/control-pollination.service';
import { ControlPollinationTask } from 'src/app/model/control-pollination-task';
import { UserService } from 'src/app/service/user.service';
import { User } from 'src/app/model/user';
import { TaskStatus } from 'src/app/common/task-status';
import { QualityControlService } from 'src/app/service/tasks/quality-control.service';
import { QualityControlTask } from 'src/app/model/quality-control-task';
import { HarvestModel } from 'src/app/model/harvest';
import { HarvestService } from 'src/app/service/tasks/harvest.service';
import { DefectModel } from 'src/app/model/defect';
import { DefectService } from 'src/app/service/tasks/defect.service';

@Component({
  selector: 'app-task-status',
  templateUrl: './task-status.page.html',
  styleUrls: ['./task-status.page.scss'],
})
export class TaskStatusPage implements OnInit {
  @ViewChild("id1") id1!: IonSelect;
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
  posponedDay:number;
  numOfCheck:number;
  tandanId:String;
  flowerStatus:String;
  qcSv:String;
  qcSvId:String;
  tandanStatus:String;
  returnPage:String = '';
  treeBlock:String;
  defect:String;
  defectId:number;
  weight:String;
  userList:User[] = [];
  defectList:DefectModel[] = [];

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
    private controlPollinationService: ControlPollinationService,
    private qualityControlService: QualityControlService,
    private harvestService: HarvestService,
    private userServices: UserService,
    private defectService: DefectService,
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.date = this.datePipe.transform(Date.now(),"yyyy-MM-dd");
    this.time = this.datePipe.transform(Date.now(),"HH:mm a");
    this.name = this.accountService.getSessionDetails().nama;
    this.userRole = this.accountService.getUserRole();
    this.activatedRoute.params.subscribe(params => {
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
      if(params['tandanId']!=null){
        this.tandanId = params['tandanId'];
      }
      if(params['tandanStatus']!=null){
        this.tandanStatus = params['tandanStatus'];
      }
      if(params['defect']!=null){
        this._getDefectList(params['defect']);
      }
      if(params['taskId']!=null){
        this.taskId = params['taskId'];
        if(this.taskId != undefined){
          this._getTask(params['taskId']);
        }
      }
      if(params['returnPage']!=undefined){
        // this.returnPage = params['returnPage'];
      }
    });
  }

  _getDefectList(defectCode){
    this.defectId = defectCode;
    this.defectService.getAll((res:[DefectModel])=>{
      res.forEach(el => {
        this.defectList.push(el);
      });
      this.defect = this._getDefectName(defectCode);
    },false);
  }

  _getDefectName(code){
    let retVal = "NA";
    if(code == 99999)
    retVal = "Lain-lain";
    else{
      this.defectList.forEach(el => {
        if(el.id == code){
          retVal = el.nama;
        }
      });
    }

    return retVal;
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
  
  submitPollenPrep(){
    // todo: Add post data
    let url:string;
    if(this.returnPage == null || this.returnPage == "" || this.returnPage == undefined){
      url = '/app/tabs/tab1/pollen-prep-form';
    }else{
      url = '/app/tabs/tab1/'+this.returnPage.toString();
    }
    if(this.tandanStatus == "ok"){
      this.modalService.successPrompt("QC telah berjaya dihantar kepada Penyelia").then(
        (value)=>{
          setTimeout(() => {
            this.router.navigateByUrl(
              url,
              {
                replaceUrl : true
              }
              );
            },
            500
          );
        }
      );
    }else{
      this.modalService.successPrompt("Tandan yang rosak telah dihapuskan").then(
        (value)=>{
          setTimeout(() => {
            this.router.navigateByUrl(
              '/app/tabs/tab1',
              {
                replaceUrl : true
              }
              );
            },
            500
          );
        }
      );
    }
  }

  _updateDefect(tandan_id:number){
    this.tandanService.updateDefect(tandan_id.toString(),this.defectId.toString(),(resDefect:TandanResponse)=>{
      this.router.navigate(
        [
          '/app/tabs/tab1/'
        ]
      );
    });
  }

  submitCPDefect(){
    this.submitCP(TaskStatus.defect);
  }

  submitNormalCp(){
    this.submitCP(TaskStatus.created);
  }

  async submitCP(status:TaskStatus){
    if(this.taskType == 'debungposponed'){
      this.controlPollinationService.updateRemarksNumber(
        this.taskId,
        this.remark,
        this.id1?.value?.toString(),
        status,
        (resCP:ControlPollinationTask)=>{
          if(this.defect == null){
            this.router.navigate(
              [
                '/app/tabs/tab1/control-pollen-form',
                {
                  taskId:resCP.id,
                }
              ]
            );
          }else{
            this._updateDefect(resCP.tandan_id);
          }
        }
      );
    }else{
      const formData = new FormData();
      const response = await fetch(this.photo.dataUrl);
      const blob = await response.blob();
      formData.append('url_gambar', blob, "task_"+this.taskId+"."+this.photo.format);
      this.baggingService.getById(this.taskId,(res:BaggingModel)=>{
        formData.append('tandan_id',res.tandan_id.toString());
        formData.append('pokok_id',res.pokok_id.toString());
        formData.append('catatan',this.remark?.toString());
        formData.append('id_sv_cp',this.accountService.getSessionDetails().no_kakitangan);
        formData.append('pengesah_id',this.id1?.value?.toString());
        this.controlPollinationService.create(formData,status,(resCP:ControlPollinationTask)=>{
          if(this.defect == null){
            this.router.navigate(
              [
                '/app/tabs/tab1/control-pollen-form',
                {
                  taskId:resCP.id,
                }
              ]
            );
          }else{
            this._updateDefect(resCP.tandan_id);
          }
        });
      });
    }
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
    formData.append('catatan',this.remark?.toString());
    formData.append('pengesah_id',this.id1.value?.toString());
    formData.append('tandan_id',this.tandanId.toString());

    this.baggingService.createTask(formData,async (res:BaggingModel)=>{
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

  _getCPTask(taskId:String){
    if(this.userRole == UserRole.penyelia_balut){
      this.controlPollinationService.getById(taskId,(res:ControlPollinationTask)=>{
        this.serverImage = `${environment.storageUrl}${res.url_gambar}`;
        this.remark = res.catatan;
        this.tandanId = res.tandan_id.toString();
      });
    }else{
      this.baggingService.getById(this.taskId,(res:BaggingModel)=>{
        this.tandanId = res.tandan_id.toString();
        this._getTandanInfo(this.tandanId);
      });
    }
  }

  _getPosponedCPTask(taskId:String){
    this.controlPollinationService.getById(taskId,(res:ControlPollinationTask)=>{
      this.tandanId = res.tandan_id.toString();
      this.posponedDay = parseInt(res.tambahan_hari);
      this.numOfCheck = parseInt(res.bil_pemeriksaan);
      this.treeId = res.pokok_id.toString();
      if(res.url_gambar!=null){
        this.serverImage = `${environment.storageUrl}${res.url_gambar}`;
      }
      this._getTreeNumber();
    });
  }

  _getQCTask(taskId:String){
    if(this.userRole == UserRole.penyelia_qa){
      this.qualityControlService.getById(taskId,(res:QualityControlTask)=>{
        this.serverImage = `${environment.storageUrl}${res.url_gambar}`;
        this.remark = res.catatan;
        this.tandanId = res.tandan_id.toString();
      });
    }else{
      this.qualityControlService.getById(taskId,(res:QualityControlTask)=>{
        this.qcSvId = res.pengesah_id;
        this.tandanId = res.tandan_id.toString();
        this._getTandanInfo(this.tandanId);
      });
    }
  }

  _getHarvestTask(taskId:String){
    if(this.userRole == UserRole.penyelia_tuai){
      this.harvestService.getById(taskId,(res:HarvestModel)=>{
        this.serverImage = `${environment.storageUrl}${res.url_gambar}`;
        this.remark = res.catatan;
        this.weight = res.berat_tandan?.toString();
        this.tandanId = res.tandan_id.toString();
      });
    }else{
      this.harvestService.getById(taskId,(res:HarvestModel)=>{
        this.qcSvId = res.pengesah_id;
        this.tandanId = res.tandan_id.toString();
        this._getTandanInfo(this.tandanId);
      });
    }
  }

  async _getTask(taskId:String){
    if(this.taskType == 'debung'){
      this._getCPTask(taskId);
    }else if(this.taskType == 'debungposponed'){
      this._getPosponedCPTask(taskId);
    }else if(this.taskType == 'qc'){
      this._getQCTask(taskId);
    }else if(this.taskType == 'qcsv'){
      this._getQCTask(taskId);
    }else if(this.taskType == 'tuai'){
      this._getHarvestTask(taskId);
    }else if(this.taskType == 'harvestsv'){
      this._getHarvestTask(taskId);
    }else{
      this.baggingService.getById(taskId,(res:BaggingModel)=>{
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
      },false);
    }
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
    if(this.taskType == 'debung'){
      this.controlPollinationService.updateVerify(
        this.taskId,
        this.tandanId,
        this.accountService.getSessionDetails().no_kakitangan.toString(),
        this.svRemark,
        TaskStatus.verified,
        (res:ControlPollinationTask)=>{
          this._promptCompleted("Tugasan Telah Berjaya Di Sahkan");
        }
      );
    }else if(this.taskType == 'qcsv'){
      this.qualityControlService.updateVerify(
        this.taskId,
        this.svRemark,
        TaskStatus.verified,
        (res:QualityControlTask)=>{
          this._promptCompleted("Tugasan Telah Berjaya Di Sahkan");
        }
      );
    }else if(this.taskType == 'harvestsv'){
      this.harvestService.updateVerify(
        this.taskId,
        this.svRemark,
        TaskStatus.verified,
        (res:QualityControlTask)=>{
          this._promptCompleted("Tugasan Telah Berjaya Di Sahkan");
        }
      );
    }else{
      this.baggingService.verify(
        this.taskId,
        this.accountService.getSessionDetails().no_kakitangan.toString(),
        this.svRemark,
        TaskStatus.verified,
        (res:BaggingModel)=>{
          this._promptCompleted("Tugasan Telah Berjaya Di Sahkan");
        }
      );
    }
  }

  async reject(){
    if(this.taskType == 'debung'){
      this.controlPollinationService.updateVerify(
        this.taskId,
        this.tandanId,
        this.accountService.getSessionDetails().no_kakitangan.toString(),
        this.svRemark,
        TaskStatus.rejected,
        (res:ControlPollinationTask)=>{
          this._promptCompleted("Tugasan Telah Berjaya Di Tolak");
        }
      );
    }else if(this.taskType == 'qcsv'){
      this.qualityControlService.updateVerify(
        this.taskId,
        this.svRemark,
        TaskStatus.rejected,
        (res:QualityControlTask)=>{
          this._promptCompleted("Tugasan Telah Berjaya Di Tolak");
        }
      );
    }else if(this.taskType == 'harvestsv'){
      this.harvestService.updateVerify(
        this.taskId,
        this.svRemark,
        TaskStatus.rejected,
        (res:QualityControlTask)=>{
          this._promptCompleted("Tugasan Telah Berjaya Di Tolak");
        }
      );
    }else{
      this.baggingService.verify(
        this.taskId,
        this.accountService.getSessionDetails().no_kakitangan.toString(),
        this.svRemark,
        TaskStatus.rejected,
        (res:BaggingModel)=>{
          this._promptCompleted("Tugasan Telah Berjaya Di Tolak");
        }
      );
    }
  }

  async _createCPPosponed(){
    const formData = new FormData();
    const response = await fetch(this.photo.dataUrl);
    const blob = await response.blob();
    formData.append('url_gambar', blob, "task_"+this.taskId+"."+this.photo.format);
    this.baggingService.getById(this.taskId,(res:BaggingModel)=>{
      formData.append('tambahan_hari',this.posponedDay.toString());
      formData.append('bil_pemeriksaan',"1");
      formData.append('id_sv_cp',this.accountService.getSessionDetails().no_kakitangan);
      formData.append('tandan_id',res.tandan_id.toString());
      formData.append('pokok_id',res.pokok_id.toString());
      this.controlPollinationService.create(formData,TaskStatus.postpone,(resCP:ControlPollinationTask)=>{
        this.modalService.successPrompt("Proses telah berjaya dianjakkan kepada +"+this.posponedDay+" hari").then((value1)=>{
            this.router.navigateByUrl(
              '/app/tabs/tab1',
              {
                replaceUrl : true
              }
            );
          });
      });
    });
  }

  _updateCPPosponed(){
    this.controlPollinationService.updateAdditionalDaysNumber(
      this.taskId,
      this.posponedDay.toString(),
      this.numOfCheck.toString(),
      (resCP:ControlPollinationTask)=>{
        this.modalService.successPrompt("Proses telah berjaya dianjakkan kepada +"+this.posponedDay+" hari").then((value1)=>{
            this.router.navigateByUrl(
              '/app/tabs/tab1',
              {
                replaceUrl : true
              }
            );
          }
        );
    });
  }

  pospone(){
    this.modalService.yesNoPrompt("Anjak hari?").then((value)=>{
      let user_selection:UserContinueSelection = value['data'];
      if(user_selection == UserContinueSelection.yes){
        this.modalService.posponePrompt().then(async (value1)=>{
          if(value1['data'] != null){
            if(this.posponedDay== null){
              this.posponedDay = value1['data'];
              this._createCPPosponed();
            }else{
              this.posponedDay = this.posponedDay+parseInt(value1['data']);
              this.numOfCheck++;
              this._updateCPPosponed();
            }
          }
        });
      }else if(user_selection == UserContinueSelection.no){

      }
    });
  }

  _getTreeNumber(){
    this.treeService.getById(this.treeId,(res:PokokResponse)=>{
      this.treeNum = res.progeny+'-'+res.no_pokok;
      this.treeBlock = res.blok;
      this._getSupervisors();
    })
  }

  _getSupervisors(){
    if(this.userRole == UserRole.petugas_balut){
      this.userServices.getByRole(UserRole.penyelia_balut.toString(),(res:[User])=>{
        if(this.treeBlock != null){
          res.forEach(el => {
            if(el.blok == this.treeBlock){
              this.userList.push(el);
            }
          });
        }else{
          this.userList = res;
        }
        if(this.userList.length == 0){
          this.userList = res;
        }
        this._getTandanId();
      });
    }else if(this.userRole == UserRole.petugas_qa){
      this.userServices.getByRole(UserRole.penyelia_qa.toString(),(res:[User])=>{
        res.forEach(el => {
          if(el.no_kakitangan == this.qcSvId){
            this.qcSv = el.nama;
          }
        });
      });
    }
  }

  _getTandanId(){
    if(this.tandanId == null){
      this.tandanService.getAll((res:[TandanResponse])=>{
        res.forEach(el => {
          if(el.no_daftar == this.regNo){
            this.tandanId = el.id.toString();
          }
        });
      });
    }
  }

  submitQcDefect(){
    this._submitQc(TaskStatus.defect);
  }

  submitNormalQc(){
    this._submitQc(TaskStatus.done);
  }

  async _submitQc(status:TaskStatus){
    const formData = new FormData();
    const response = await fetch(this.photo.dataUrl);
    const blob = await response.blob();
    formData.append('url_gambar', blob, "task_"+this.taskId+"."+this.photo.format);
    formData.append('_method','put');
    formData.append('catatan',this.remark?.toString());
    formData.append('status',status);
    this.qualityControlService.update(this.taskId,formData,(res:QualityControlTask)=>{
      if(this.defect == null){
        this.router.navigate(
          [
            '/app/tabs/tab1'
          ]
        );
      }else{
        this._updateDefect(res.tandan_id);
      }
    });
  }

  submitHarvestDefect(){
    this._submitHarvest(TaskStatus.defect);
  }

  submitHarvestNormal(){
    this._submitHarvest(TaskStatus.done);
  }

  async _submitHarvest(status:TaskStatus){
    const formData = new FormData();
    const response = await fetch(this.photo.dataUrl);
    const blob = await response.blob();
    formData.append('url_gambar', blob, "task_"+this.taskId+"."+this.photo.format);
    formData.append('_method','put');
    formData.append('catatan',this.remark?.toString());
    formData.append('berat_tandan',this.weight?.toString());
    formData.append('status',status);
    this.harvestService.update(this.taskId,formData,(res:HarvestModel)=>{
      if(this.defect == null){
        this.router.navigate(
          [
            '/app/tabs/tab1'
          ]
        );
      }else{
        this._updateDefect(res.tandan_id);
      }
    });
  }

}
