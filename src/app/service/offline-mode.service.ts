import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { TandanCycle } from '../common/tandan-cycle';
import { TaskStatus } from '../common/task-status';
import { BaggingModel } from '../model/bagging';
import { ControlPollinationModel } from '../model/control-pollination';
import { DefectModel } from '../model/defect';
import { HarvestModel } from '../model/harvest';
import { OfflineBaggingModel } from '../model/offline-bagging';
import { OfflineBaggingResponseModel } from '../model/offline-bagging-response';
import { OfflineControlPollinationModel } from '../model/offline-control-pollination';
import { OfflineHarvestModel } from '../model/offline-harvest';
import { OfflineQualityControlModel } from '../model/offline-quality-control';
import { PokokResponse } from '../model/pokok-respons';
import { PollenPreparationModel } from '../model/pollen-preparation-model';
import { QualityControlModel } from '../model/quality-control';
import { TandanResponse } from '../model/tandan-response';
import { User } from '../model/user';
import { AccountService, UserRole } from './account.service';
import { ModalService } from './modal.service';
import { OfflineBaggingService } from './offline/offline-bagging.service';
import { OfflineControlPollinationService } from './offline/offline-control-pollination.service';
import { OfflineHarvestService } from './offline/offline-harvest.service';
import { OfflineQcService } from './offline/offline-qc.service';
import { StorageService } from './storage.service';
import { BaggingService } from './tasks/bagging.service';
import { ControlPollinationService } from './tasks/control-pollination.service';
import { DefectService } from './tasks/defect.service';
import { HarvestService } from './tasks/harvest.service';
import { PollenPreparationService } from './tasks/pollen-preparation.service';
import { QualityControlService } from './tasks/quality-control.service';
import { TandanService } from './tasks/tandan.service';
import { TreeService } from './tasks/tree.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class OfflineModeService {


  bagging:BaggingModel[] = [];
  tandanList:TandanResponse[] = [];
  treeList:PokokResponse[] = [];
  baggingSvList:User[] = [];
  newCpTaskList:BaggingModel[] = [];
  posponedBaggingTasks:BaggingModel[] = [];
  posponedCpTasks:ControlPollinationModel[] = [];
  posponedQcTasks:QualityControlModel[] = [];
  posponedHarvestTasks:HarvestModel[] = [];
  defectList:DefectModel[] = [];
  qcList:QualityControlModel[] = [];
  harvestList:HarvestModel[] = [];
  finishedBaggingUpload:boolean;
  finishedCPRedoUpload:boolean;
  finishedNormalCPUpload:boolean;
  finishedBaggingDownload:boolean;
  constructor(
    private storageService:StorageService,
    private tandanService:TandanService,
    private treeService:TreeService,
    private userService:UserService,
    private controlPollinationService:ControlPollinationService,
    private accountService:AccountService,
    private offlineBaggingService:OfflineBaggingService,
    private offlineCpService:OfflineControlPollinationService,
    private baggingService:BaggingService,
    private loadingCtrl:LoadingController,
    private defectService:DefectService,
    private qcService:QualityControlService,
    private offlineQCService:OfflineQcService,
    private qualityControlService:QualityControlService,
    private harvestService:HarvestService,
    private offlineHarvestService:OfflineHarvestService,
    private modalService:ModalService,
    private pollenPrepService:PollenPreparationService,
  ) {
  }

  async getTreeList(){
    this.treeList = await this.storageService.get(this.storageService.offlineTreeList);
    if(this.treeList == null){
      this.treeList = [];
    }
    return this.treeList;
  }

  async getTandanList(){
    this.tandanList = await this.storageService.get(this.storageService.offlineTandanList);
    if(this.tandanList == null){
      this.tandanList = [];
    }
    return this.tandanList;
  }

  async getBaggingSvList(){
    this.baggingSvList = await this.storageService.get(this.storageService.baggingSvList);
    if(this.baggingSvList == null){
      this.baggingSvList = [];
    }
    return this.baggingSvList;
  }

  async getNewCpList(){
    this.newCpTaskList = await this.storageService.get(this.storageService.offlineNewCp);
    if(this.newCpTaskList == null){
      this.newCpTaskList = [];
    }
    return this.newCpTaskList;
  }

  async getNewQcList(){
    this.qcList = await this.storageService.get(this.storageService.offlineNewQc);
    if(this.qcList == null){
      this.qcList = [];
    }
    return this.qcList;
  }

  async getNewHarvestList(){
    this.harvestList = await this.storageService.get(this.storageService.offlineNewHarvest);
    if(this.harvestList == null){
      this.harvestList = [];
    }
    return this.harvestList;
  }

  async getPosponedBaggingList(){
    this.posponedBaggingTasks = await this.storageService.get(this.storageService.posponedBaggingTask);
    if(this.posponedBaggingTasks == null){
      this.posponedBaggingTasks = [];
    }
    return this.posponedBaggingTasks;
  }

  async getPosponedCPList(){
    this.posponedCpTasks = await this.storageService.get(this.storageService.rejectedCPTask);
    if(this.posponedCpTasks == null){
      this.posponedCpTasks = [];
    }
    return this.posponedCpTasks;
  }

  sync(){
    if(this.accountService.getUserRole() == UserRole.petugas_balut){
      this._syncBaggingTask();
    }else if(this.accountService.getUserRole() == UserRole.petugas_balut_fatherpalm){
      this._syncBaggingAndHarvestFatherpalm();
    }else if(this.accountService.getUserRole() == UserRole.petugas_qc){
      this._syncQC();
    }else if(this.accountService.getUserRole() == UserRole.petugas_tuai){
      this._syncHarvest();
    }else{}
  }

  OfflineMode(state:boolean){
    this.storageService.set(this.storageService.offlineMode,state);
  }

  async isOfflineMode(){
    return await this.storageService.get(this.storageService.offlineMode);
  }

  async _uploadBaggingTasks(){
    let tasks:OfflineBaggingModel[] = await this.offlineBaggingService.getSavedBaggingTasks();
    // let redoTasks:OfflineBaggingModel[] = await this.offlineBaggingService.getSavedRedoBaggingTasks();
    if(tasks == null){
      tasks = [];
      this._baggingCpSyncComplete('baggingUpload');
    }
    // if(redoTasks == null){
    //   redoTasks = [];
    // }
    //upload normal bagging task
    while(tasks.length > 0){
      let task:OfflineBaggingModel = tasks.pop();
      var formData = new FormData();

      for ( var key in task ) {
        if(key != 'url_gambar_data' && key != 'url_gambar' && key != 'pokok'){
          formData.append(key, task[key]);
        }
      }

      const response = await fetch(task.url_gambar_data);
      const blob = await response.blob();
      formData.append('url_gambar', blob, task.url_gambar);
      this.baggingService.createTask(formData,async (res:BaggingModel)=>{
        this._uploadBaggingCallback(task.tandan_id,"bagging")
      },false);
    }
    // upload redo bagging task
    // while(redoTasks.length > 0){
    //   let task:OfflineBaggingModel = redoTasks.pop();
    //   var formData = new FormData();

    //   for ( var key in task ) {
    //     if(key != 'url_gambar_data' && key != 'url_gambar' && key != 'pokok' && key != 'id'){
    //       formData.append(key, task[key]);
    //     }
    //   }

    //   const response = await fetch(task.url_gambar_data);
    //   const blob = await response.blob();
    //   formData.append('url_gambar', blob, task.url_gambar);
    //   this.baggingService.createTask(formData,async (res:BaggingModel)=>{},false);
    //   this.baggingService.update(task.id,{status:TaskStatus.redo},()=>{});
    //   this.storageService.set(this.storageService.redoBaggingOfflineData,redoTasks);
    // }
  }

  async _uploadCPTasks(){
    let tasks:OfflineControlPollinationModel[] = await this.offlineCpService.getSavedCPTasks();
    let redoTasks:OfflineControlPollinationModel[] = await this.offlineCpService.getSavedRedoCPTasks();
    let posponed2xTasks:OfflineControlPollinationModel[] = await this.offlineCpService.getSavedPosponed2CPTasks();
    if(tasks == null){
      tasks = [];
    }if(redoTasks == null){
      redoTasks = [];
    }

    if(tasks.length == 0){
      this._baggingCpSyncComplete('cpNormalUpload');
    }if(redoTasks.length == 0){
      this._baggingCpSyncComplete('cpRedoUpload');
    }
    // normal task
    while(tasks.length > 0){
      let task:OfflineControlPollinationModel = tasks.pop();
      var formData = new FormData();

      for ( var key in task ) {
        if(key != 'url_gambar_data' && key != 'url_gambar'){
          formData.append(key, task[key]);
        }
      }

      const response = await fetch(task.url_gambar_data);
      const blob = await response.blob();
      formData.append('url_gambar[]', blob, task.url_gambar);
      this.controlPollinationService.create(formData,task.status ,async (res:ControlPollinationModel)=>{
        this._uploadCpCallback(task.tandan_id.toString(),'cpNormal');
        this.loadingCtrl.getTop()?.then((v:HTMLIonLoadingElement)=>{
          v.dismiss();
        });
      });
    }
    //redo task
    while(redoTasks.length > 0){
      let task:OfflineControlPollinationModel = redoTasks.pop();
      var formData = new FormData();

      for ( var key in task ) {
        if(key != 'url_gambar_data' && key != 'url_gambar' && key != 'id'){
          formData.append(key, task[key]);
        }
      }

      const response = await fetch(task.url_gambar_data);
      const blob = await response.blob();
      formData.append('url_gambar[]', blob, task.url_gambar);
      this.controlPollinationService.create(formData,task.status ,async (res:ControlPollinationModel)=>{
        this.controlPollinationService.update(task.id,{status:TaskStatus.redo},()=>{
          this._uploadCpCallback(task.id.toString(),'cpRedo');
          this.loadingCtrl.getTop()?.then((v:HTMLIonLoadingElement)=>{
            v.dismiss();
          });
        });
      });
    }
    //posponed update task
    while(posponed2xTasks.length > 0){
      let task:OfflineControlPollinationModel = posponed2xTasks.pop();
      var formData = new FormData();

      for ( var key in task ) {
        if(key != 'url_gambar_data' && key != 'url_gambar' && key != 'id'){
          formData.append(key, task[key]);
        }
      }

      const response = await fetch(task.url_gambar_data);
      const blob = await response.blob();
      formData.append('url_gambar[]', blob, task.url_gambar);
      formData.append('_method','PUT');
      this.controlPollinationService.updateUsingForm(task.id,formData,()=>{
        this._uploadCpCallback(task.id.toString(),'cpPosponed');
        this.loadingCtrl.getTop()?.then((v:HTMLIonLoadingElement)=>{
          v.dismiss();
        });
      });
    }
  }

  private _getTreeAndTandan(nextMethod){
    this.treeService.getAll((res:[PokokResponse])=>{
      this.treeList = res;
      this.storageService.set(this.storageService.offlineTreeList,this.treeList);
      this.tandanService.getAll((res2:[TandanResponse])=>{
        this.tandanList = res2;
        this.storageService.set(this.storageService.offlineTandanList,this.tandanList);
        nextMethod();
      },true,'Fetching Tandan List');
    },'Fetching Tree List');
  }

  private async _getPosponedBaggingTask(){
    this.posponedBaggingTasks = [];
    this.baggingService.getByUserId(this.accountService.getSessionDetails().id,(res:[BaggingModel])=>{
      res.forEach(el => {
        if(el.status == TaskStatus.rejected){
          this.posponedBaggingTasks.push(el);
        }
      });
      this.storageService.set(this.storageService.posponedBaggingTask,this.posponedBaggingTasks);
      this._getPosponedCPTask();
    },false)
  }

  private async _getPosponedCPTask(){
    this.posponedCpTasks = [];
    this.controlPollinationService.getByUserId(this.accountService.getSessionDetails().id,(res:[ControlPollinationModel])=>{
      res.forEach(el => {
        if(el.status == TaskStatus.rejected || el.status == TaskStatus.postpone){
          this.posponedCpTasks.push(el);
        }
      });
      this.storageService.set(this.storageService.rejectedCPTask,this.posponedCpTasks);
      this.defectService.getAll((defectRes:[DefectModel])=>{
        this.defectList = defectRes;
        this.storageService.set(this.storageService.offlineDefectList,defectRes);
        this.pollenPrepService.getAll(
          (res:PollenPreparationModel[])=>{
            let pollenList:PollenPreparationModel[] = [];
            res.forEach(el => {
              if(el.status == TaskStatus.verified && el.kerosakan_id == null){
                pollenList.push(el);
              }
            });
            this.storageService.set(this.storageService.pollenPrep,pollenList);
            this._baggingCpSyncComplete('download');
            this.loadingCtrl.getTop()?.then((v:HTMLIonLoadingElement)=>{
              v.dismiss();
            });
          }
        );
      },false);
    },false)
  }

  private _baggingCpSyncComplete(syncItem:string){
    this.finishedBaggingUpload = true;
    if(syncItem == 'baggingUpload'){
      this.finishedBaggingUpload = true;
    }else if(syncItem == 'cpRedoUpload'){
      this.finishedCPRedoUpload = true;
    }else if(syncItem == 'cpNormalUpload'){
      this.finishedNormalCPUpload = true;
    }else{
      this.finishedBaggingDownload = true;
    }
    if( this.finishedBaggingUpload &&
        this.finishedBaggingDownload && 
        this.finishedCPRedoUpload && 
        this.finishedNormalCPUpload
      ){
        if(this.accountService.getUserRole() == UserRole.petugas_balut_fatherpalm){
          this.modalService.successPrompt("Tugas Balut dan Tuai Berjaya di sync").then();
        }else{
          this.modalService.successPrompt("Tugas Balut dan Kawalan Pendebungaan Berjaya di sync").then();
        }
    }
  }

  private async _uploadBaggingCallback(id:string, taskType:string){
    if(taskType == 'bagging'){
      let tasks:OfflineBaggingModel[] = await this.offlineBaggingService.getSavedBaggingTasks();
      if(tasks == null){
        tasks = [];
      }
      let retArray:OfflineBaggingModel[] = [];
      tasks.forEach(el => {
        if(el.tandan_id != id){
          retArray.push(el);
        }
      });
      await this.storageService.set(this.storageService.baggingOfflineData,retArray);
      if(retArray.length == 0){
        this._baggingCpSyncComplete('baggingUpload');
      }
    }
  }

  private async _uploadCpCallback(id:string, taskType){
    if(taskType == 'cpNormal'){
      let tasks:OfflineControlPollinationModel[] = await this.offlineCpService.getSavedCPTasks();
      if(tasks == null){
        tasks = [];
      }
      let retArray:OfflineControlPollinationModel[] = [];
      tasks.forEach(el => {
        if(el.tandan_id != id){
          retArray.push(el);
        }
      });
      this.storageService.set(this.storageService.controlPollinationOfflineData,retArray);
      if(retArray.length == 0){
        this._baggingCpSyncComplete('cpNormalUpload');
      }
    }else if(taskType == 'cpRedo'){
      let tasks:OfflineControlPollinationModel[] = await this.offlineCpService.getSavedRedoCPTasks();
      if(tasks == null){
        tasks = [];
      }
      let retArray:OfflineControlPollinationModel[] = [];
      tasks.forEach(el => {
        if(el.id != id){
          retArray.push(el);
        }
      });
      this.storageService.set(this.storageService.redoCPOfflineData,retArray);
      if(retArray.length == 0){
        this._baggingCpSyncComplete('cpRedoUpload');
      }
    }else if(taskType == 'cpPosponed'){
      let tasks:OfflineControlPollinationModel[] = await this.offlineCpService.getSavedPosponed2CPTasks();
      if(tasks == null){
        tasks = [];
      }
      let retArray:OfflineControlPollinationModel[] = [];
      tasks.forEach(el => {
        if(el.id != id){
          retArray.push(el);
        }
      });
      this.storageService.set(this.storageService.posponedCPOfflineData,retArray);
      if(retArray.length == 0){
        this._baggingCpSyncComplete('cpPosponedUpload');
      }
    }
  }

  private async _syncBaggingAndCp(){
    this.finishedBaggingUpload = false;
    this.finishedCPRedoUpload = false;
    this.finishedNormalCPUpload = false;
    this.finishedBaggingDownload = false;
    setTimeout(async ()=>{
      if( !this.finishedBaggingUpload ||
          !this.finishedBaggingDownload ||
          !this.finishedNormalCPUpload ||
          !this.finishedCPRedoUpload
        ){
        this.modalService.successPrompt("Gagal Sync Tugas Balut dan Kawalan Pendebungaan").then();
        (await this.loadingCtrl.getTop())?.dismiss();
      }
    },120000)
    this._uploadBaggingTasks();
    this._uploadCPTasks();
    await this._getTreeAndTandan(
      ()=>{
        this.userService.getByRole(UserRole.penyelia_balut,async (res3:[User])=>{
          this.baggingSvList = res3;
          this.storageService.set(this.storageService.baggingSvList,this.baggingSvList);
          (await this.loadingCtrl.create({message:"Sila Tunggu"})).present();
          this.controlPollinationService.getNewlyCreatedTask(
            this.accountService.getSessionDetails().id,
            async (res1:[BaggingModel])=>{
            this.newCpTaskList = res1;
            this.storageService.set(this.storageService.offlineNewCp,this.newCpTaskList);
            (await this.loadingCtrl.create({message:"Sila Tunggu"})).present();
            this._getPosponedBaggingTask();
          },false);
        },'Fetching Supervisor List');
      }
    )
  }

  async _uploadQCTasks(){
    let tasks:OfflineQualityControlModel[] = await this.offlineQCService.getSavedQcTasks();
    while(tasks.length > 0){
      let task:OfflineQualityControlModel = tasks.pop();
      var formData = new FormData();
      formData.append('catatan',task.catatan);
      formData.append('status',task.status);
      formData.append('kerosakan_id',task.defectId? task.defectId.toString() : "");

      const response = await fetch(task.url_gambar_data);
      const blob = await response.blob();
      formData.append('url_gambar', blob, task.url_gambar);
      if(task.currentStatus != TaskStatus.rejected){
        formData.append('_method','put');
        this.qualityControlService.update(task.id,formData,async (res:QualityControlModel)=>{
          this.loadingCtrl.getTop()?.then((v:HTMLIonLoadingElement)=>{
            v.dismiss();
          });
        });
      }else{
        formData.append('pokok_id',task.pokok_id.toString());
        formData.append('tandan_id',task.tandan_id.toString());
        formData.append('id_sv_qc',this.accountService.getSessionDetails().id.toString());
        formData.append('pengesah_id',task.pengesah_id.toString());
        this.qualityControlService.create(formData,async (res:QualityControlModel)=>{
          this.qualityControlService.update(task.id,{status:TaskStatus.redo,_method:"put"},(res:QualityControlModel)=>{
            this.loadingCtrl.getTop()?.then((v:HTMLIonLoadingElement)=>{
              v.dismiss();
            });
          });
        });
      }
      this.storageService.set(this.storageService.qcOfflineData,tasks);
    }
  }

  private _syncQC(){
    this._uploadQCTasks();
    this._getTreeAndTandan(
      ()=>{
        this.loadingCtrl.getTop()?.then((v:HTMLIonLoadingElement)=>{
          v.dismiss();
        });
        this.qcService.getByUserId(
          this.accountService.getSessionDetails().id,
          (res:QualityControlModel[])=>{
            this.qcList = [];
            res.forEach(el => {
              if(el.status == TaskStatus.created || el.status == TaskStatus.rejected){
                this.qcList.push(el);
              }
            });
            this.storageService.set(this.storageService.offlineNewQc,this.qcList);
            this.defectService.getAll((defectRes:[DefectModel])=>{
              this.defectList = defectRes;
              this.storageService.set(this.storageService.offlineDefectList,defectRes);
              this.userService.getByRole(
                UserRole.penyelia_qc,
                (res3:[User])=>{
                  this.modalService.successPrompt("Tugas Kawalan Kualiti Berjaya di sync").then();
                  this.baggingSvList = res3;
                  this.storageService.set(this.storageService.baggingSvList,this.baggingSvList);
                  this.loadingCtrl.getTop()?.then((v:HTMLIonLoadingElement)=>{
                    v.dismiss();
                  });
                }
              ),'Fetching Supervisor List';
            });
          }
        );
      }
    );
  }

  async _uploadHarvestTasks(){
    let tasks:OfflineHarvestModel[] = await this.offlineHarvestService.getSavedHarvestTasks();
    while(tasks.length > 0){
      let task:OfflineHarvestModel = tasks.pop();
      var formData = new FormData();
      formData.append('catatan',task.catatan? task.catatan :"");
      formData.append('status',task.status);
      formData.append('kerosakan_id',task.defectId? task.defectId.toString() : "");
      formData.append('berat_tandan',task.berat_tandan.toString());
      formData.append('id_sv_harvest',task.id_sv_harvest.toString());
      const response = await fetch(task.url_gambar_data);
      const blob = await response.blob();
      formData.append('url_gambar', blob, task.url_gambar);
      if(task.currentStatus != TaskStatus.rejected){
        formData.append('_method','put');
        this.harvestService.update(task.id,formData,async (res:HarvestModel)=>{
          this.loadingCtrl.getTop()?.then((v:HTMLIonLoadingElement)=>{
            v.dismiss();
          });
        });
      }else{
        formData.append('pokok_id',task.pokok_id.toString());
        formData.append('tandan_id',task.tandan_id.toString());
        formData.append('id_sv_harvest',this.accountService.getSessionDetails().id.toString());
        formData.append('pengesah_id',task.pengesah_id.toString());
        this.harvestService.create(formData,async (res:QualityControlModel)=>{
          this.harvestService.update(task.id,{status:TaskStatus.redo,_method:"put"},(res:QualityControlModel)=>{
            this.loadingCtrl.getTop()?.then((v:HTMLIonLoadingElement)=>{
              v.dismiss();
            });
          });
        });
      }
      this.storageService.set(this.storageService.harvestOfflineData,tasks);
    }
  }

  private _syncHarvest(){
    this._uploadHarvestTasks();
    this._getTreeAndTandan(
      ()=>{
        this.harvestService.getByUserId(
          this.accountService.getSessionDetails().id,
          this.accountService.getSessionDetails().blok,
          (res:HarvestModel[])=>{
            this.harvestList = [];
            res.forEach(el => {
              if(el.status == TaskStatus.created || el.status == TaskStatus.rejected){
                this.harvestList.push(el);
              }
            });
            this.loadingCtrl.getTop()?.then((v:HTMLIonLoadingElement)=>{
              v.dismiss();
            });
            this.storageService.set(this.storageService.offlineNewHarvest,this.harvestList);
            this.defectService.getAll((defectRes:[DefectModel])=>{
              this.modalService.successPrompt("Tugas Tuai Berjaya di sync").then();
              this.defectList = defectRes;
              this.storageService.set(this.storageService.offlineDefectList,defectRes);
              this.loadingCtrl.getTop()?.then((v:HTMLIonLoadingElement)=>{
                v.dismiss();
              });
            });
          }
        );
      }
    );
  }

  private async _syncBaggingAndHarvestFatherpalm(){
    this.finishedBaggingUpload = false;
    this.finishedCPRedoUpload = false;
    this.finishedNormalCPUpload = false;
    this.finishedBaggingDownload = false;
    setTimeout(async ()=>{
      if( !this.finishedBaggingUpload ||
          !this.finishedBaggingDownload ||
          !this.finishedNormalCPUpload ||
          !this.finishedCPRedoUpload
        ){
        this.modalService.successPrompt("Gagal Sync Tugas Balut dan Tuai").then();
        (await this.loadingCtrl.getTop())?.dismiss();
      }
    },120000)
    this._uploadBaggingTasks();
    this._uploadCPTasks();
    this._uploadHarvestTasks();
    await this._getTreeAndTandan(
      ()=>{
        this.userService.getByRole(UserRole.penyelia_fatherpalm,async (res3:[User])=>{
          this.baggingSvList = res3;
          this.storageService.set(this.storageService.baggingSvList,this.baggingSvList);
          (await this.loadingCtrl.create({message:"Sila Tunggu"})).present();
          this.controlPollinationService.getNewlyCreatedTask(
            this.accountService.getSessionDetails().id,
            async (res1:[BaggingModel])=>{
            this.newCpTaskList = res1;
            this.storageService.set(this.storageService.offlineNewCp,this.newCpTaskList);
            (await this.loadingCtrl.create({message:"Sila Tunggu"})).present();
            this.harvestService.getByUserId(
              this.accountService.getSessionDetails().id,
              this.accountService.getSessionDetails().blok,
              (res:HarvestModel[])=>{
                this.harvestList = [];
                res.forEach(el => {
                  if(el.status == TaskStatus.created ||
                      el.status == TaskStatus.rejected ||
                      el.status == TaskStatus.postpone){
                    this.harvestList.push(el);
                  }
                });
                this.loadingCtrl.getTop()?.then((v:HTMLIonLoadingElement)=>{
                  v.dismiss();
                });
                this.storageService.set(this.storageService.offlineNewHarvest,this.harvestList);
                this._getPosponedBaggingTask();
              }
            );
          },false);
        },'Fetching Supervisor List');
      }
    )
  }

  private async _syncBaggingTask(){
    let tasks:OfflineBaggingModel[] = await this.offlineBaggingService.getSavedBaggingTasks();
    if(tasks == null){
      tasks = [];
    }
    var formData = new FormData();
    formData.append('user_id', this.accountService.getSessionDetails().id.toString());

    for(let i=0; i<tasks.length; i++){
      for ( var key in tasks[i] ) {
        if(key != 'url_gambar_data' && key != 'url_gambar' && key != 'pokok'){
          formData.append(key+'['+i+']', tasks[i][key]);
        }
      }
      let response = await fetch(tasks[i].url_gambar_data);
      let blob = await response.blob();
      formData.append('url_gambar['+i+']', blob, tasks[i].url_gambar);
      formData.append('status['+i+']', TaskStatus.done);
    }

    this.baggingService.OfflineUpload(formData,async (res:OfflineBaggingResponseModel)=>{
      await this._removeUploadedBaggingTask(res);
      await this._saveOfflineBaggingInf(res);
    });
  }

  private async _removeUploadedBaggingTask(res:OfflineBaggingResponseModel){
    let tasks:OfflineBaggingModel[] = await this.offlineBaggingService.getSavedBaggingTasks();
    let tempTasks:OfflineBaggingModel[] = [];
    let tempTandanId:string[] = [];
    if(tasks == null){
      tasks = [];
    }
    
    res.bagging.forEach(el => {
      tempTandanId.push(el.tandan_id.toString());
    });

    console.log(tempTandanId);
    console.log(tasks);

    tasks.forEach(el => {
      if(!tempTandanId.includes(el.tandan_id)){
        tempTasks.push(el);
      }
    });

    await this.storageService.set(this.storageService.baggingOfflineData,tempTasks);

    if(tempTasks.length == 0){
      this.modalService.successPrompt("Tugas Balut dan Kawalan Pendebungaan Berjaya di sync").then();
    }else{
      this.modalService.successPrompt("Terdapat tugas balut yang tidak berjaya di muat naik. Jumlah tugas tidak berjaya:"+tempTasks.length).then();
    }
  }

  private async _saveOfflineBaggingInf(res:OfflineBaggingResponseModel){
    this.baggingSvList = res.user;
    await this.storageService.set(this.storageService.baggingSvList,this.baggingSvList);

    this.newCpTaskList = res.newCP;
    await this.storageService.set(this.storageService.offlineNewCp,this.newCpTaskList);

    this.treeList = res.pokok;
    await this.storageService.set(this.storageService.offlineTreeList,this.treeList);

    this.tandanList = res.tandan;
    await this.storageService.set(this.storageService.offlineTandanList,this.tandanList);

    this.posponedCpTasks = res.posponedCP;
    await this.storageService.set(this.storageService.rejectedCPTask,this.posponedCpTasks);

    this.defectList = res.kerosakan;
    await this.storageService.set(this.storageService.offlineDefectList,this.defectList);

    let pollenList:PollenPreparationModel[] = res.pollen;
    await this.storageService.set(this.storageService.pollenPrep,pollenList);
  }

}
