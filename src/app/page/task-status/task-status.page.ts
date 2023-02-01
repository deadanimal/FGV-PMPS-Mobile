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
import { ControlPollinationModel } from 'src/app/model/control-pollination';
import { UserService } from 'src/app/service/user.service';
import { User } from 'src/app/model/user';
import { TaskStatus } from 'src/app/common/task-status';
import { QualityControlService } from 'src/app/service/tasks/quality-control.service';
import { QualityControlModel } from 'src/app/model/quality-control';
import { HarvestModel } from 'src/app/model/harvest';
import { HarvestService } from 'src/app/service/tasks/harvest.service';
import { DefectModel } from 'src/app/model/defect';
import { DefectService } from 'src/app/service/tasks/defect.service';
import { TreeType } from 'src/app/common/tree-type';
import { InAppTaskCycle } from 'src/app/common/inapp-task-cycle';
import { PollenPreparationService } from 'src/app/service/tasks/pollen-preparation.service';
import { PollenPreparationModel } from 'src/app/model/pollen-preparation-model';
import { OfflineModeService } from 'src/app/service/offline-mode.service';
import { OfflineTreeService } from 'src/app/service/offline/offline-tree.service';
import { OfflineTandanService } from 'src/app/service/offline/offline-tandan.service';
import { OfflineBaggingService } from 'src/app/service/offline/offline-bagging.service';
import { OfflineBaggingModel } from 'src/app/model/offline-bagging';
import { OfflineControlPollinationService } from 'src/app/service/offline/offline-control-pollination.service';
import { OfflineControlPollinationModel } from 'src/app/model/offline-control-pollination';
import { OfflineQcService } from 'src/app/service/offline/offline-qc.service';
import { OfflineQualityControlModel } from 'src/app/model/offline-quality-control';
import { OfflineHarvestService } from 'src/app/service/offline/offline-harvest.service';
import { OfflineHarvestModel } from 'src/app/model/offline-harvest';

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
  qcSvId:number;
  tandanStatus:String;
  returnPage:String = '';
  treeBlock:String;
  defect:String;
  defectId:number;
  weight:String;
  treeType:String;
  userList:User[] = [];
  defectList:DefectModel[] = [];
  isOfflineMode = false;
  enableImgDeleteBtn = false;
  submitClicked = false;
  roles = UserRole;

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
    private pollenPrepService: PollenPreparationService,
    private offlineModeService: OfflineModeService,
    private offlineTreeService: OfflineTreeService,
    private offlineTandanService: OfflineTandanService,
    private offlineBaggingService: OfflineBaggingService,
    private offlineCpService: OfflineControlPollinationService,
    private offlineQcService: OfflineQcService,
    private offlineHarvestService: OfflineHarvestService,
  ) { }

  ngOnInit() {
  }

  async ionViewDidEnter(){
    this.submitClicked = false;
    this.isOfflineMode = await this.offlineModeService.isOfflineMode();
    this.date = this.datePipe.transform(Date.now(),"dd-MM-YYYY");
    this.time = this.datePipe.transform(Date.now(),"HH:mm a");
    let user = await this.accountService._getDataFromStorage();
    this.name = user.nama;
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
    this.serverImage = null;
  }

  async _promptCompleted(title:string = "Aktiviti anda telah dihantar kepada penyelia"){
    (await this.loadingCtrl.getTop())?.dismiss();
    this.modalService.successPrompt(title).then(
      (value)=>{
        setTimeout(() => {
          let task:string;
          let url:string;
          if( this.accountService.getUserRole() == UserRole.penyelia_balut ||
              this.accountService.getUserRole() == UserRole.penyelia_qc ||
              this.accountService.getUserRole() == UserRole.penyelia_tuai ||
              this.accountService.getUserRole() == UserRole.penyelia_makmal ){
              if(this.taskType == InAppTaskCycle.bagging){
                task = "wrap"
              }else if(this.taskType == InAppTaskCycle.qcSv){
                task = "Kawalan Kualiti (QC)"
              }else if(this.taskType == InAppTaskCycle.harvestSv){
                task = "Tuai"
              }else if(this.taskType == InAppTaskCycle.cp){
                task = "cp"
              }
              url = '/app/tabs/tab1/main-task';
            }else{
              url = '/app/tabs/tab1';
            }
            this.router.navigate(
              [
                url,
                {
                  task:task
                }
              ],
              {
                replaceUrl : true
              }
            );
          },50);
      }
    );
  }
  submitPollenPrep(){
    this.submitClicked = true;
    if(this.taskId != null){
      this.updatePollenPrep();
    }else{
      this.createPollenPrep();
    }
  }

  async createPollenPrep(){
    const formData = new FormData();
    const response = await fetch(this.photo.dataUrl);
    const blob = await response.blob();
    formData.append('url_gambar', blob, "task_"+this.taskId+"."+this.photo.format);
    formData.append('pokok_id',this.treeId.toString());
    formData.append('tandan_id',this.tandanId.toString());
    formData.append('id_sv_pollen',this.accountService.getSessionDetails().id.toString());
    formData.append('catatan',this.remark? this.remark.toString() : "");
    formData.append('pengesah_id',this.id1?.value?.toString());
    formData.append('status',TaskStatus.created);

    this.pollenPrepService.create(formData,
      (res:PollenPreparationModel)=>{
        if(res.id != null){
          let url:string;
          if(this.returnPage == null || this.returnPage == "" || this.returnPage == undefined){
            url = 'app/tabs/tab1/pollen-prep-form';
          }else{
            url = 'app/tabs/tab1/'+this.returnPage.toString();
          }
          if(this.tandanStatus == "ok"){
            this.modalService.successPrompt("QC telah berjaya dihantar kepada Penyelia").then(
              (value)=>{
                setTimeout(
                  () => {
                    this.router.navigate(
                      [
                        url,
                        {
                          taskId:res.id,
                          tandanId:this.tandanId,
                        }
                      ]
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
                  50
                );
              }
            );
          }
        }else{
          this.modalService.textAndBtnPrompt('Ralat, Sila cuba lagi','OK');
        }
      });
  }

  async updatePollenPrep(){
    let date = new Date();
    const formData = new FormData();
    const response = await fetch(this.photo.dataUrl);
    const blob = await response.blob();
    formData.append('url_gambar2', blob, "task_"+this.taskId+"."+this.photo.format);
    formData.append('id_sv_pollen',this.accountService.getSessionDetails().id.toString());
    formData.append('catatan2',this.remark? this.remark.toString() : "");
    formData.append('pengesah_id',this.id1?.value?.toString());
    formData.append('tarikh_qc', date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate());
    formData.append('_method','PUT');

    this.pollenPrepService.updatePost(this.taskId,formData,
      (res:PollenPreparationModel)=>{
        if(res.id != null){
          let url:string;
          if(this.returnPage == null || this.returnPage == "" || this.returnPage == undefined){
            url = 'app/tabs/tab1/pollen-prep-form';
          }else{
            url = 'app/tabs/tab1/'+this.returnPage.toString();
          }
          if(this.tandanStatus == "ok"){
            this.modalService.successPrompt("QC telah berjaya dihantar kepada Penyelia").then(
              (value)=>{
                setTimeout(
                  () => {
                    this.router.navigate(
                      [
                        url,
                        {
                          taskId:this.taskId,
                          tandanId:this.tandanId,
                          qcDone:true
                        }
                      ]
                    );
                  },
                  50
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
                  50
                );
              }
            );
          }
        }else{
          this.modalService.textAndBtnPrompt('Ralat, Sila cuba lagi','OK');
        }
      });
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

  async _updateCP(status:TaskStatus){
    if(!this.isOfflineMode){
      this._showSubmitTaskAlert();
      const formData = new FormData();
      if(this.photo != null){
        const response = await fetch(this.photo.dataUrl);
        const blob = await response.blob();
        formData.append('url_gambar[]', blob, "task_"+this.taskId+"."+this.photo.format);
      }
      formData.append('catatan',this.remark? this.remark.toString() : "");
      formData.append('pengesah_id',this.id1?.value?.toString());
      formData.append('status', status);
      formData.append('kerosakan_id',this.defectId? this.defectId.toString() : "");
      formData.append('_method','PUT');
      this.controlPollinationService.updateUsingForm(
        this.taskId,
        formData,
        async (resCP:ControlPollinationModel)=>{
          (await this.loadingCtrl.getTop()).dismiss();
          this.router.navigate(
            [
              '/app/tabs/tab1/control-pollen-form',
              {
                taskId:resCP.id,
              }
            ]
          );
        },
        false
      );
    }else{
    let data:OfflineControlPollinationModel = {
      id:this.taskId,
      tandan_id:this.tandanId,
      url_gambar:"task_"+this.taskId+"."+this.photo.format,
      url_gambar_data:this.photo.dataUrl,
      id_sv_cp:this.accountService.getSessionDetails().id,
      catatan:this.remark? this.remark.toString() : "",
      pengesah_id:this.id1.value?.toString(),
      pokok_id:this.treeId,
      defect:this.defect?.toString(),
      status:status,
    };
    this.offlineCpService.savePosponedCPTask(data);
    if(this.defect == null){
      this.router.navigate(
        [
          '/app/tabs/tab1/control-pollen-form',
          {
            tandanId:this.tandanId,
            taskId:this.taskId,
            taskType:this.taskType,
          }
        ]
      );
    }else{
      this.router.navigate(
        [
          '/app/tabs/tab1/'
        ]
      );
    }
    }
  }

  private _createCpFromBagging(formData:FormData, status:TaskStatus){
    this.baggingService.getById(this.taskId,(res:BaggingModel)=>{
      formData.append('tandan_id',res.tandan_id.toString());
      formData.append('pokok_id',res.pokok_id.toString());
        this.controlPollinationService.create(formData,status,async (resCP:ControlPollinationModel)=>{
          if(this.defect == null){
            (await this.loadingCtrl.getTop())?.dismiss();
            this.router.navigate(
              [
                '/app/tabs/tab1/control-pollen-form',
                {
                  taskId:resCP.id,
                }
              ]);
          }else{
            this._promptCompleted();
          }
        },false);
      },false
    );
  }

  async _createCp(status:TaskStatus){
    if(!this.isOfflineMode){
      this._showSubmitTaskAlert();
      const formData = new FormData();
      const response = await fetch(this.photo.dataUrl);
      const blob = await response.blob();
      formData.append('url_gambar[]', blob, "task_"+this.taskId+"."+this.photo.format);
      formData.append('catatan',this.remark? this.remark.toString() : "");
      formData.append('id_sv_cp',this.accountService.getSessionDetails().id.toString());
      formData.append('pengesah_id',this.id1?.value?.toString());
      formData.append('kerosakan_id',this.defectId? this.defectId.toString() : "");
      if(this.taskType == InAppTaskCycle.rejectedCp){
        formData.append('tandan_id',this.tandanId.toString());
        formData.append('pokok_id',this.treeId.toString());
          this.controlPollinationService.create(formData,status,(resCP:ControlPollinationModel)=>{
            this.controlPollinationService.update(this.taskId,{status:TaskStatus.redo},()=>{
              this.tandanService.update(this.tandanId,{status_tandan:'aktif'},async ()=>{
                (await this.loadingCtrl.getTop())?.dismiss();
                this.router.navigate(
                  [
                    '/app/tabs/tab1/control-pollen-form',
                    {
                      taskId:resCP.id,
                    }
                  ]
                );
              },false);
            },false);
            },false
          );
      }else{
        this._createCpFromBagging(formData,status);
      }
    }else{
      let data:OfflineControlPollinationModel = {
        tandan_id:this.tandanId,
        url_gambar:"task_"+this.taskId+"."+this.photo.format,
        url_gambar_data:this.photo.dataUrl,
        id_sv_cp:this.accountService.getSessionDetails().id,
        catatan:this.remark? this.remark.toString() : "",
        pengesah_id:this.id1.value?.toString(),
        pokok_id:this.treeId,
        defect:this.defect?.toString(),
        status:status,
      };
      if(this.taskType == InAppTaskCycle.rejectedCp){
        data.id = this.taskId;
        this.offlineCpService.saveRedoCPTask(data);
      }else{
        this.offlineCpService.saveCPTask(data);
      }
      if(this.defect == null){
        this.router.navigate(
          [
            '/app/tabs/tab1/control-pollen-form',
            {
              tandanId:this.tandanId,
              taskId:this.taskId,
              taskType:this.taskType,
            }
          ]
        );
      }else{
        this.router.navigate(
          [
            '/app/tabs/tab1/'
          ]
        );
      }
    }
  }

  async submitCP(status:TaskStatus){
    this.submitClicked = true;
    if(this.taskType == 'debungposponed'){
      this._updateCP(status);
    }else{
      this._createCp(status);
    }
  }

  private async _successSubmitTask(){
    (await this.loadingCtrl.getTop())?.dismiss();
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

  private async _showSubmitTaskAlert(){
    const modal= await this.loadingCtrl.create({message:"Tugas Sedang Dihantar"});
    modal.present();
  }

  async submitTask(){
    this.submitClicked = true;
    const formData = new FormData();
    const response = await fetch(this.photo.dataUrl);
    const blob = await response.blob();
    // for tandan
    formData.append('no_daftar',this.regNo.toString());
    formData.append('tarikh_daftar',this.datePipe.transform(Date.now(),"yyyy-MM-dd").toString());
    formData.append('pokok_id',this.treeId.toString());
    if(this.taskType == InAppTaskCycle.posponedbagging){
      formData.append('kitaran',InAppTaskCycle.bagging);
    }else{
      formData.append('kitaran',this.taskType.toString());
    }
    // for bagging
    formData.append('url_gambar', blob, "task_"+this.taskId+"."+this.photo.format);
    formData.append('id_sv_balut',this.accountService.getSessionDetails().id.toString());
    formData.append('catatan',this.remark? this.remark.toString() : "");
    formData.append('pengesah_id',this.id1.value?.toString());
    formData.append('tandan_id',this.tandanId.toString());

    if(!this.isOfflineMode){
      await this._showSubmitTaskAlert();
      this.baggingService.createTask(formData,async (res:BaggingModel)=>{
        if(res==null){
          this.loadingCtrl.dismiss();
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
          if(this.taskType == InAppTaskCycle.posponedbagging){
            this.baggingService.update(this.taskId,{status:TaskStatus.redo},(res2:BaggingModel)=>{
              this._successSubmitTask();
            });
          }else{
            this._successSubmitTask();
          }
        }
      },false);
    }else{
      let data:OfflineBaggingModel = {
        no_daftar:this.regNo.toString(),
        tarikh_daftar:this.datePipe.transform(Date.now(),"yyyy-MM-dd").toString(),
        pokok_id:this.treeId.toString(),
        kitaran:this.taskType.toString(),
        url_gambar:"task_"+this.taskId+"."+this.photo.format,
        url_gambar_data:this.photo.dataUrl,
        id_sv_balut:this.accountService.getSessionDetails().id,
        catatan:this.remark? this.remark.toString() : "",
        pengesah_id:this.id1.value?.toString(),
        tandan_id:this.tandanId.toString(),
      };
      if(this.taskType == InAppTaskCycle.posponedbagging){
        data.id = this.taskId.toString();
        this.offlineBaggingService.saveRedoBaggingTask(data);
      }else{
        await this.offlineBaggingService.saveBaggingTask(data);
        await this.offlineTandanService.updateTreeId(this.tandanId,this.treeId);
      }

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
  }

  async _getCPTask(taskId:String){
    if(this.userRole == UserRole.penyelia_balut){
      this.controlPollinationService.getById(taskId,(res:ControlPollinationModel)=>{
        this.serverImage = `${environment.storageUrl}${res.url_gambar}`;
        this.remark = res.catatan;
        this.tandanId = res.tandan_id.toString();
        if(res.kerosakan_id != null){
          this._getDefectList(res.kerosakan_id);
        }
        this._getTandanInfo(this.tandanId);
        this._getUserInfo(res.id_sv_cp);
        this.treeNum = res.pokok.progeny+'-'+res.pokok.no_pokok;
      });
    }else{
      if(!this.isOfflineMode){
        this.baggingService.getById(this.taskId,(res:BaggingModel)=>{
          this.tandanId = res.tandan_id.toString();
          this._getTandanInfo(this.tandanId);
        });
      }else{
        let newTask:BaggingModel = await this.offlineCpService.getNewTaskById(parseInt(this.taskId.toString()));
        this.tandanId = newTask.tandan_id.toString();
        this._getTandanInfo(this.tandanId);
      }
    }
  }

  async _getPosponedBaggingTask(){
    this.enableImgDeleteBtn = true;
      if(!this.isOfflineMode){
        this.baggingService.getById(this.taskId,(res:BaggingModel)=>{
          this.tandanId = res.tandan_id.toString();
          this._getTandanInfo(this.tandanId);
        });
      }else{
        let newTask:BaggingModel = await this.offlineBaggingService.getPosponedBaggingTaskById(parseInt(this.taskId.toString()));
        this.tandanId = newTask.tandan_id.toString();
        this._getTandanInfo(this.tandanId);
      }
  }

  async _getPosponedCPTask(taskId:String){
    if(!this.isOfflineMode){
      this.controlPollinationService.getById(taskId,(res:ControlPollinationModel)=>{
        this.enableImgDeleteBtn = true;
        this.tandanId = res.tandan_id.toString();
        this.posponedDay = parseInt(res.tambahan_hari);
        this.numOfCheck = parseInt(res.bil_pemeriksaan);
        this.treeId = res.pokok_id.toString();

        this._getTandanInfo(this.tandanId);
        this._getTreeNumber();
      });
    }else{
      let newTask:OfflineControlPollinationModel = await this.offlineCpService.getPostponedTaskById(this.taskId.toString());
      this.tandanId = newTask.tandan_id.toString();
      this.treeId = newTask.pokok_id.toString();
      this.enableImgDeleteBtn = true;
      this.posponedDay = parseInt(newTask.tambahan_hari);
      this.numOfCheck = parseInt(newTask.bil_pemeriksaan);
      this._getTandanInfo(this.tandanId);
    }
  }

  async _getRejectedCPTask(taskId:String){
    if(!this.isOfflineMode){
      this.controlPollinationService.getById(taskId,(res:ControlPollinationModel)=>{
        this.enableImgDeleteBtn = true;
        this.tandanId = res.tandan_id.toString();
        this.treeId = res.pokok_id.toString();

        this._getTandanInfo(this.tandanId);
        this._getTreeNumber();
      });
    }else{
      let newTask:OfflineControlPollinationModel = await this.offlineCpService.getRejectedTaskById(this.taskId.toString());
      this.tandanId = newTask.tandan_id.toString();
      this.treeId = newTask.pokok_id.toString();
      this._getTandanInfo(this.tandanId);
    }
  }

  async _getQCTask(taskId:String){
    if(this.userRole == UserRole.penyelia_qc){
      this.qualityControlService.getById(taskId,(res:QualityControlModel)=>{
        this.serverImage = `${environment.storageUrl}${res.url_gambar}`;
        this.remark = res.catatan;
        this.tandanId = res.tandan_id.toString();
        this.treeNum = res.pokok.progeny+'-'+res.pokok.no_pokok;
        this._getTandanInfo(this.tandanId);
        if(res.kerosakan_id != null){
          this._getDefectList(res.kerosakan_id);
        }
        this._getUserInfo(res.id_sv_qc);
      });
    }else{
      if(!this.isOfflineMode){
        this.qualityControlService.getById(taskId,(res:QualityControlModel)=>{
          this.qcSvId = res.pengesah_id;
          this.tandanId = res.tandan_id.toString();
          this._getTandanInfo(this.tandanId);
        });
      }else{
        let newTask:QualityControlModel = await this.offlineQcService.getNewTaskById(parseInt(this.taskId.toString()));
        this.tandanId = newTask.tandan_id.toString();
        this.qcSvId = newTask.pengesah_id;
        this._getTandanInfo(this.tandanId);
      }
    }
  }

  async _getPosponedQCTask(taskId:String){
    if(!this.isOfflineMode){
      this.qualityControlService.getById(taskId,(res:QualityControlModel)=>{
        this.qcSvId = res.pengesah_id;
        this.tandanId = res.tandan_id.toString();
        this._getTandanInfo(this.tandanId);
        this._getSupervisors();
      });
    }else{
      let newTask:QualityControlModel = await this.offlineQcService.getNewTaskById(parseInt(this.taskId.toString()));
      this.tandanId = newTask.tandan_id.toString();
      this.qcSvId = newTask.pengesah_id;
      this._getTandanInfo(this.tandanId);
    }
  }

  async _getHarvestTask(taskId:String){
    if(this.userRole == UserRole.penyelia_tuai){
      this.harvestService.getById(taskId,(res:HarvestModel)=>{
        this.serverImage = `${environment.storageUrl}${res.url_gambar}`;
        this.remark = res.catatan;
        this.weight = res.berat_tandan?.toString();
        this.tandanId = res.tandan_id.toString();
        this.treeId = res.pokok_id.toString();
        this._getTandanInfo(this.tandanId);
        if(res.kerosakan_id != null){
          this._getDefectList(res.kerosakan_id);
        }
        this._getUserInfo(res.id_sv_harvest);
      });
    }else{
      if(!this.isOfflineMode){
        this.harvestService.getById(taskId,(res:HarvestModel)=>{
          this.qcSvId = res.pengesah_id;
          this.tandanId = res.tandan_id.toString();
          this.treeId = res.pokok_id.toString();
          this._getTandanInfo(this.tandanId);
        });
      }else{
        let newTask:HarvestModel = await this.offlineHarvestService.getNewTaskById(parseInt(this.taskId.toString()));
        this.tandanId = newTask.tandan_id.toString();
        this.qcSvId = newTask.pengesah_id;
        this._getTandanInfo(this.tandanId);
      }
    }
  }

  async _getPostponedHarvestTask(taskId:String){
    if(!this.isOfflineMode){
      this.harvestService.getById(taskId,(res:HarvestModel)=>{
        this.qcSvId = res.pengesah_id;
        this.tandanId = res.tandan_id.toString();
        this.treeId = res.pokok_id.toString();
        this._getTandanInfo(this.tandanId);
      });
    }else{
      let newTask:HarvestModel = await this.offlineHarvestService.getNewTaskById(parseInt(this.taskId.toString()));
      this.tandanId = newTask.tandan_id.toString();
      this.qcSvId = newTask.pengesah_id;
      this._getTandanInfo(this.tandanId);
    }
  }

  _getPollenPrepTask(){
    if(this.userRole == UserRole.penyelia_makmal){
      this.pollenPrepService.getById(this.taskId,(res:PollenPreparationModel)=>{
        this.serverImage = `${environment.storageUrl}${res.url_gambar}`;
        this.remark = res.catatan;
        this.tandanId = res.tandan_id.toString();
      });
    }else{
      this._getTandanInfo(this.tandanId);
    }
  }

  async _getTask(taskId:String){
    if(this.taskType == 'debung'){
      this._getCPTask(taskId);
    }else if(this.taskType == InAppTaskCycle.posponedbagging){
      this._getPosponedBaggingTask();
    }else if(this.taskType == 'debungposponed'){
      this._getPosponedCPTask(taskId);
    }else if(this.taskType == InAppTaskCycle.rejectedCp){
      this._getRejectedCPTask(taskId);
    }else if(this.taskType == 'qc'){
      this._getQCTask(taskId);
    }else if(this.taskType == InAppTaskCycle.posponedqc){
      this._getPosponedQCTask(taskId);
    }else if(this.taskType == InAppTaskCycle.qcSv){
      this._getQCTask(taskId);
    }else if(this.taskType == 'tuai'){
      this._getHarvestTask(taskId);
    }else if(this.taskType == InAppTaskCycle.posponedharvest){
      this._getPostponedHarvestTask(taskId);
    }else if(this.taskType == 'harvestsv'){
      this._getHarvestTask(taskId);
    }else if(this.taskType == InAppTaskCycle.pp || this.taskType == InAppTaskCycle.ppSv){
      this._getPollenPrepTask();
    }else if(this.taskType == InAppTaskCycle.pollenPrepForm){
      this._getPollenPrepTask();
    }else if(this.taskType == InAppTaskCycle.bagging && 
              ( this.accountService.getUserRole() == UserRole.penyelia_balut ||
                this.accountService.getUserRole() == UserRole.penyelia_fatherpalm
              )
            ){
      this.baggingService.getById(taskId,(res:BaggingModel)=>{
        this.date = this.datePipe.transform(Date.parse(res.created_at.toString()),"yyyy-MM-dd");
        this.remark = res.catatan;
        if(res.url_gambar!=null){
          this.serverImage = `${environment.storageUrl}${res.url_gambar}`;
        }
        this._getUserInfo(res.id_sv_balut);
        if(res.tandan_id != null){
          this.tandanId = res.tandan_id.toString();
          this.treeId = res.pokok_id.toString();
          this._getTandanInfo(res.tandan_id.toString());
        }else{
          this.treeId = "-";
          this.regNo = "-";
        }
      },true);
    }else{
      
    }
  }

  async _getUserInfo(userId:number){
    this.taskService.getUserById(userId).subscribe(
      (res:LoginResponseModel) => {
        this.name = res.nama;
      },
      (err:HttpErrorResponse) => {
      }
    );
  }

  async _getTandanInfo(tandanId:String){
    if(!this.isOfflineMode){
      this.tandanService.getById(tandanId,(res:TandanResponse)=>{
        this.regNo = res.no_daftar;
        this.treeId = res.pokok_id.toString();
        this._getTreeNumber();
      });
    }else{
      let tandan:TandanResponse = await this.offlineTandanService.getById(parseInt(tandanId.toString()));
      this.regNo = tandan.no_daftar;
      this.treeId = tandan.pokok_id.toString();
      this._getTreeNumber();
    }
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
        this.accountService.getSessionDetails().id,
        this.svRemark,
        TaskStatus.verified,
        (res:ControlPollinationModel)=>{
          if(this.defect != null){
            this.tandanService.updateDefect(this.tandanId,this.defectId.toString(),()=>{
              this._promptCompleted("Tugasan Telah Berjaya Di Sahkan");
            });
          }else{
            this._promptCompleted("Tugasan Telah Berjaya Di Sahkan");
          }
        }
      );
    }else if(this.taskType == InAppTaskCycle.qcSv){
      this.qualityControlService.updateVerify(
        this.taskId,
        this.svRemark,
        TaskStatus.verified,
        (res:QualityControlModel)=>{
          if(this.defect != null){
            this.tandanService.updateDefect(this.tandanId,this.defectId.toString(),()=>{
              this._promptCompleted("Tugasan Telah Berjaya Di Sahkan");
            });
          }else{
            this._promptCompleted("Tugasan Telah Berjaya Di Sahkan");
          }
        }
      );
    }else if(this.taskType == 'harvestsv'){
      this.harvestService.updateVerify(
        this.taskId,
        this.svRemark,
        this.accountService.getSessionDetails().id,
        TaskStatus.verified,
        (res:QualityControlModel)=>{
          if(this.defect != null){
            this.tandanService.updateDefect(this.tandanId,this.defectId.toString(),()=>{
              this._promptCompleted("Tugasan Telah Berjaya Di Sahkan");
            });
          }else{
            this._promptCompleted("Tugasan Telah Berjaya Di Sahkan");
          }
        }
      );
    }else if(this.taskType == InAppTaskCycle.ppSv){
      this.pollenPrepService.updateVerify(
        this.taskId,
        this.svRemark,
        TaskStatus.verified,
        (res:PollenPreparationModel)=>{
          this._promptCompleted("Tugasan Telah Berjaya Di Sahkan");
        }
      );
    }else{
      this.baggingService.verify(
        this.taskId,
        this.accountService.getSessionDetails().id,
        this.svRemark,
        TaskStatus.verified,
        (res:BaggingModel)=>{
          if(this.treeType == TreeType.Fatherpalm){
            const formData = new FormData();
            formData.append('pokok_id',res.pokok_id.toString());
            formData.append('tandan_id',res.tandan_id.toString());
            formData.append('status',TaskStatus.created);
            this.harvestService.create(formData,(res:HarvestModel)=>{
              this._promptCompleted("Tugasan Telah Berjaya Di Sahkan");
            });
          }else{
            this._promptCompleted("Tugasan Telah Berjaya Di Sahkan");
          }
        }
      );
    }
  }

  async reject(){
    if(this.taskType == 'debung'){
      this.controlPollinationService.updateVerify(
        this.taskId,
        this.tandanId,
        this.accountService.getSessionDetails().id,
        this.svRemark,
        TaskStatus.rejected,
        (res:ControlPollinationModel)=>{
          this.tandanService.updateDefect(this.tandanId,"",()=>{
            this._promptCompleted("Tugasan Telah Berjaya Di Tolak");
          });
        }
      );
    }else if(this.taskType == InAppTaskCycle.qcSv){
      this.qualityControlService.updateVerify(
        this.taskId,
        this.svRemark,
        TaskStatus.rejected,
        (res:QualityControlModel)=>{
          this._promptCompleted("Tugasan Telah Berjaya Di Tolak");
        }
      );
    }else if(this.taskType == 'harvestsv'){
      this.harvestService.updateVerify(
        this.taskId,
        this.svRemark,
        this.accountService.getSessionDetails().id,
        TaskStatus.rejected,
        (res:QualityControlModel)=>{
          this._promptCompleted("Tugasan Telah Berjaya Di Tolak");
        }
      );
    }else if(this.taskType == InAppTaskCycle.ppSv){
      this.pollenPrepService.updateVerify(
        this.taskId,
        this.svRemark,
        TaskStatus.rejected,
        (res:QualityControlModel)=>{
          this._promptCompleted("Tugasan Telah Berjaya Di Tolak");
        }
      );
    }else{
      this.baggingService.verify(
        this.taskId,
        this.accountService.getSessionDetails().id,
        this.svRemark,
        TaskStatus.rejected,
        (res:BaggingModel)=>{
          this.tandanService.updateDefect(this.tandanId,"",()=>{
            this._promptCompleted("Tugasan Telah Berjaya Di Tolak");
          });
        }
      );
    }
  }

  async _createCPPosponed(){
    const formData = new FormData();
    const response = await fetch(this.photo.dataUrl);
    const blob = await response.blob();
    formData.append('url_gambar', blob, "task_"+this.taskId+"."+this.photo.format);
    formData.append('tambahan_hari',this.posponedDay.toString());
    formData.append('bil_pemeriksaan',"1");
    formData.append('id_sv_cp',this.accountService.getSessionDetails().id.toString());
    formData.append('tandan_id',this.tandanId.toString());
    formData.append('pokok_id',this.treeId.toString());
    if(!this.isOfflineMode){
      this.controlPollinationService.create(formData,TaskStatus.postpone,(resCP:ControlPollinationModel)=>{
        this.modalService.successPrompt("Proses telah berjaya dianjakkan kepada +"+this.posponedDay+" hari").then((value1)=>{
          this.router.navigateByUrl(
            '/app/tabs/tab1',
            {
              replaceUrl : true
            }
          );
        });
      });
    }else{
      let data:OfflineControlPollinationModel = {
        tandan_id:this.tandanId,
        url_gambar:"task_"+this.taskId+"."+this.photo.format,
        url_gambar_data:this.photo.dataUrl,
        id_sv_cp:this.accountService.getSessionDetails().id,
        catatan:this.remark? this.remark.toString() : "",
        pengesah_id:this.id1.value?.toString(),
        pokok_id:this.treeId,
        defect:this.defect?.toString(),
        bil_pemeriksaan:'1',
        tambahan_hari:this.posponedDay.toString(),
        status:TaskStatus.postpone,
      };
      if(this.taskType == InAppTaskCycle.rejectedCp){
        data.id = this.taskId;
        this.offlineCpService.saveRedoCPTask(data);
      }else{
        this.offlineCpService.saveCPTask(data);
      }
      this.router.navigate(
        [
          '/app/tabs/tab1/'
        ]
      );
    }
  }

  async _updateCPPosponed(){
    const formData = new FormData();
    if(this.photo != null){
      const response = await fetch(this.photo.dataUrl);
      const blob = await response.blob();
      formData.append('url_gambar', blob, "task_"+this.taskId+"."+this.photo.format);
    }
    formData.append('tambahan_hari',this.posponedDay.toString());
    formData.append('bil_pemeriksaan',this.numOfCheck.toString());
    formData.append('status', TaskStatus.postpone);
    formData.append('kerosakan_id',this.defectId? this.defectId.toString() : "");
    if(!this.isOfflineMode){
      this.controlPollinationService.updateUsingForm(
        this.taskId,
        formData,
        (resCP:ControlPollinationModel)=>{
          this.modalService.successPrompt("Proses telah berjaya dianjakkan kepada +"+this.posponedDay+" hari").then((value1)=>{
              this.router.navigateByUrl(
                '/app/tabs/tab1',
                {
                  replaceUrl : true
                }
              );
            }
          );
        }
      );
    }else{
      let data:OfflineControlPollinationModel = {
        id:this.taskId,
        tandan_id:this.tandanId,
        url_gambar:"task_"+this.taskId+"."+this.photo.format,
        url_gambar_data:this.photo.dataUrl,
        id_sv_cp:this.accountService.getSessionDetails().id,
        catatan:this.remark? this.remark.toString() : "",
        pengesah_id:this.id1.value?.toString(),
        pokok_id:this.treeId,
        defect:this.defect?.toString(),
        bil_pemeriksaan:this.numOfCheck.toString(),
        tambahan_hari:this.posponedDay.toString(),
        status:TaskStatus.postpone,
      };
      data.id = this.taskId;
      this.offlineCpService.savePosponedCPTask(data);
      this.router.navigate(
        [
          '/app/tabs/tab1/'
        ]
      );
    }
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

  async _getTreeNumber(){
    if(!this.isOfflineMode){
      this.treeService.getById(this.treeId,async (res:PokokResponse)=>{
        this.treeNum = res.progeny+'-'+res.no_pokok;
        this.treeBlock = res.blok;
        this.treeType = res.jantina;
        this._getSupervisors();
      })
    }else{
      let treeInfo = await this.offlineTreeService.getById(this.treeId);
      this.treeNum = treeInfo.progeny+'-'+treeInfo.no_pokok;
      this.treeBlock = treeInfo.blok;
      this.treeType = treeInfo.jantina;
      this._getOfflineSupervisors();
      this._getTandanId();
    }
  }

  async _getOfflineSupervisors(){
    let svList = await this.offlineModeService.getBaggingSvList();
    if(this.userRole == UserRole.petugas_balut){
      svList.forEach(el => {
        if(el.blok.includes(this.treeBlock.toString())){
          this.userList.push(el);
        }
      });
    }else if(this.userRole == UserRole.petugas_qc){
      svList.forEach(el => {
        if(el.id == this.qcSvId){
          this.qcSv = el.nama;
        }
      });
    }
  }

  _getSupervisors(){
    if(this.userRole == UserRole.petugas_balut){
      this.userServices.getByRole(UserRole.penyelia_balut.toString(),(res:[User])=>{
        if(this.treeBlock != null){
          res.forEach(el => {
            if(el.blok.includes(this.treeBlock.toString())){
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
    }else if(this.userRole == UserRole.petugas_balut_fatherpalm){
      this.userServices.getByRole(UserRole.penyelia_fatherpalm.toString(),(res:[User])=>{
        if(this.treeBlock != null){
          res.forEach(el => {
            if(el.blok.includes(this.treeBlock.toString())){
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
    }else if(this.userRole == UserRole.petugas_qc){
      this.userServices.getByRole(UserRole.penyelia_qc.toString(),(res:[User])=>{
        res.forEach(el => {
          if(el.id == this.qcSvId){
            this.qcSv = el.nama;
          }
        });
      });
    }else if(this.userRole == UserRole.petugas_makmal){
      this.userServices.getByRole(UserRole.penyelia_makmal.toString(),(res:[User])=>{
        if(this.treeBlock != null){
          res.forEach(el => {
            if(el.blok.includes(this.treeBlock.toString())){
              this.userList.push(el);
            }
          });
        }else{
          this.userList = res;
        }
        if(this.userList.length == 0){
          this.userList = res;
        }
      });
    }else if(this.userRole == UserRole.petugas_tuai){
      this.userServices.getByRole(UserRole.penyelia_tuai.toString(),(res:[User])=>{
        res.forEach(el => {
          if(el.id == this.qcSvId){
            this.qcSv = el.nama;
          }
        });
      });
    }
  }

  async _getTandanId(){
    if(this.tandanId == null){
      if(!this.isOfflineMode){
        this.tandanService.getAll((res:[TandanResponse])=>{
          res.forEach(el => {
            if(el.no_daftar == this.regNo){
              this.tandanId = el.id.toString();
            }
          });
        });
      }else{
        let tandanInfos = await this.offlineTandanService.getAll();
        tandanInfos.forEach(el => {
          if(el.no_daftar == this.regNo){
            this.tandanId = el.id.toString();
          }
        });
      }
    }
  }

  submitQcDefect(){
    this._submitQc(TaskStatus.defect);
  }

  submitNormalQc(){
    this._submitQc(TaskStatus.done);
  }

  async _submitQc(status:TaskStatus){
    this.submitClicked = true;
    if(!this.isOfflineMode){
      this._showSubmitTaskAlert();
      const formData = new FormData();
      const response = await fetch(this.photo.dataUrl);
      const blob = await response.blob();
      formData.append('url_gambar', blob, "task_"+this.taskId+"."+this.photo.format);
      formData.append('catatan',this.remark? this.remark.toString() : "");
      formData.append('status',status);
      formData.append('kerosakan_id',this.defectId? this.defectId.toString() : "");
      if(this.taskType == InAppTaskCycle.posponedqc){
        formData.append('pokok_id',this.treeId.toString());
        formData.append('tandan_id',this.tandanId.toString());
        formData.append('id_sv_qc',this.accountService.getSessionDetails().id.toString());
        formData.append('pengesah_id',this.qcSvId.toString());
        this.qualityControlService.create(formData,(res:QualityControlModel)=>{
          this.qualityControlService.update(this.taskId,{status:TaskStatus.redo,_method:"put"},(res:QualityControlModel)=>{
            this._promptCompleted();
          },false);
        },false);
      }else{
        formData.append('_method','put');
        this.qualityControlService.update(this.taskId,formData,(res:QualityControlModel)=>{
          this._promptCompleted();
        },false);
      }
    }else{
      let task = await this.offlineQcService.getNewTaskById(parseInt(this.taskId.toString()));
      let data:OfflineQualityControlModel = {
        id:this.taskId,
        tandan_id:this.tandanId.toString(),
        catatan:this.remark? this.remark.toString() : "",
        url_gambar:"task_"+this.taskId+"."+this.photo.format,
        url_gambar_data:this.photo.dataUrl,
        status:status,
        defectId:this.defectId,
        pengesah_id:this.qcSvId.toString(),
        pokok_id:this.treeId.toString(),
        currentStatus:task.status,
      };
      this.offlineQcService.saveQCTask(data);
      
      this._promptCompleted();
    }
  }

  submitHarvestDefect(){
    this._submitHarvest(TaskStatus.defect);
  }

  submitHarvestNormal(){
    this._submitHarvest(TaskStatus.done);
  }

  async _submitHarvest(status:TaskStatus){
    this.submitClicked = true;
    if(!this.isOfflineMode){
      this._showSubmitTaskAlert();
      const formData = new FormData();
      const response = await fetch(this.photo.dataUrl);
      const blob = await response.blob();
      formData.append('url_gambar', blob, "task_"+this.taskId+"."+this.photo.format);
      formData.append('catatan',this.remark? this.remark.toString() : "");
      formData.append('berat_tandan',this.weight? this.weight.toString() : "");
      formData.append('status',status);
      formData.append('kerosakan_id',this.defectId? this.defectId.toString() : "");
      formData.append('id_sv_harvest',this.accountService.getSessionDetails().id.toString());
      if(this.taskType == InAppTaskCycle.harvest){
        formData.append('_method','put');
        this.harvestService.update(this.taskId,formData,(res:HarvestModel)=>{
          this._promptCompleted();
        },false);
      }else{
        formData.append('pokok_id',this.treeId.toString());
        formData.append('tandan_id',this.tandanId.toString());
        formData.append('id_sv_harvest',this.accountService.getSessionDetails().id.toString());
        formData.append('pengesah_id',this.qcSvId.toString());
        this.harvestService.create(formData,(res:HarvestModel)=>{
          this.harvestService.update(this.taskId,{status:TaskStatus.redo,_method:"put"},(res:QualityControlModel)=>{
            this._promptCompleted();
          },false);
        },false);
      }
    }else{
      let task = await this.offlineHarvestService.getNewTaskById(parseInt(this.taskId.toString()));
      let data:OfflineHarvestModel = {
        id:this.taskId,
        berat_tandan:this.weight? this.weight.toString() : "",
        catatan:this.remark? this.remark.toString() : "",
        url_gambar:"task_"+this.taskId+"."+this.photo.format,
        url_gambar_data:this.photo.dataUrl,
        status:status,
        defectId:this.defectId,
        tandan_id:this.tandanId,
        id_sv_harvest:this.accountService.getSessionDetails().id.toString(),
        pokok_id:this.treeId.toString(),
        currentStatus:task.status,
        pengesah_id:this.qcSvId.toString(),
      };
      this.offlineHarvestService.saveHarvestTask(data);
      
      this._promptCompleted();
    }
  }

}
