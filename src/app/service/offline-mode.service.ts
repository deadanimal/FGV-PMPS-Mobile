import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { TandanCycle } from '../common/tandan-cycle';
import { TaskStatus } from '../common/task-status';
import { BaggingModel } from '../model/bagging';
import { ControlPollinationModel } from '../model/control-pollination';
import { DefectModel } from '../model/defect';
import { HarvestModel } from '../model/harvest';
import { OfflineBaggingModel } from '../model/offline-bagging';
import { OfflineControlPollinationModel } from '../model/offline-control-pollination';
import { OfflineHarvestModel } from '../model/offline-harvest';
import { OfflineQualityControlModel } from '../model/offline-quality-control';
import { PokokResponse } from '../model/pokok-respons';
import { QualityControlModel } from '../model/quality-control';
import { TandanResponse } from '../model/tandan-response';
import { User } from '../model/user';
import { AccountService, UserRole } from './account.service';
import { OfflineBaggingService } from './offline/offline-bagging.service';
import { OfflineControlPollinationService } from './offline/offline-control-pollination.service';
import { OfflineHarvestService } from './offline/offline-harvest.service';
import { OfflineQcService } from './offline/offline-qc.service';
import { StorageService } from './storage.service';
import { BaggingService } from './tasks/bagging.service';
import { ControlPollinationService } from './tasks/control-pollination.service';
import { DefectService } from './tasks/defect.service';
import { HarvestService } from './tasks/harvest.service';
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
    this.posponedCpTasks = await this.storageService.get(this.storageService.posponedCPTask);
    if(this.posponedCpTasks == null){
      this.posponedCpTasks = [];
    }
    return this.posponedCpTasks;
  }

  sync(){
    if(this.accountService.getUserRole() == UserRole.petugas_balut){
      this._syncBaggingAndCp();
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
    let redoTasks:OfflineBaggingModel[] = await this.offlineBaggingService.getSavedRedoBaggingTasks();
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
      this.baggingService.createTask(formData,async (res:BaggingModel)=>{},false);
      this.storageService.set(this.storageService.baggingOfflineData,tasks);
    }
    // upload redo bagging task
    while(redoTasks.length > 0){
      let task:OfflineBaggingModel = redoTasks.pop();
      var formData = new FormData();

      for ( var key in task ) {
        if(key != 'url_gambar_data' && key != 'url_gambar' && key != 'pokok' && key != 'id'){
          formData.append(key, task[key]);
        }
      }

      const response = await fetch(task.url_gambar_data);
      const blob = await response.blob();
      formData.append('url_gambar', blob, task.url_gambar);
      this.baggingService.createTask(formData,async (res:BaggingModel)=>{},false);
      this.baggingService.update(task.id,{status:TaskStatus.redo},()=>{});
      this.storageService.set(this.storageService.redoBaggingOfflineData,redoTasks);
    }
  }

  async _uploadCPTasks(){
    let tasks:OfflineControlPollinationModel[] = await this.offlineCpService.getSavedCPTasks();
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
      formData.append('url_gambar', blob, task.url_gambar);
      this.controlPollinationService.create(formData,task.status ,async (res:BaggingModel)=>{
        this.loadingCtrl.getTop()?.then((v:HTMLIonLoadingElement)=>{
          v.dismiss();
        });
      });
      this.storageService.set(this.storageService.controlPollinationOfflineData,tasks);
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
    })
  }

  private async _getPosponedCPTask(){
    this.posponedCpTasks = [];
    this.controlPollinationService.getByUserId(this.accountService.getSessionDetails().id,(res:[ControlPollinationModel])=>{
      res.forEach(el => {
        if(el.status == TaskStatus.rejected || el.status == TaskStatus.postpone){
          this.posponedCpTasks.push(el);
        }
      });
      this.storageService.set(this.storageService.posponedCPTask,this.posponedCpTasks);
      this.defectService.getAll((defectRes:[DefectModel])=>{
        this.defectList = defectRes;
        this.storageService.set(this.storageService.offlineDefectList,defectRes);
        this.loadingCtrl.getTop()?.then((v:HTMLIonLoadingElement)=>{
          v.dismiss();
        });
      });
    })
  }

  private async _syncBaggingAndCp(){
    this._uploadBaggingTasks();
    this._uploadCPTasks();
    await this._getTreeAndTandan(
      ()=>{
        this.userService.getByRole(UserRole.penyelia_balut,(res3:[User])=>{
          this.baggingSvList = res3;
          this.storageService.set(this.storageService.baggingSvList,this.baggingSvList);
          this.controlPollinationService.getNewlyCreatedTask(
            this.accountService.getSessionDetails().id,
            (res1:[BaggingModel])=>{
            this.newCpTaskList = res1;
            this.storageService.set(this.storageService.offlineNewCp,this.newCpTaskList);
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
      formData.append('_method','put');
      formData.append('catatan',task.catatan);
      formData.append('status',task.status);

      const response = await fetch(task.url_gambar_data);
      const blob = await response.blob();
      formData.append('url_gambar', blob, task.url_gambar);
      this.qualityControlService.update(task.id,formData,async (res:BaggingModel)=>{
        if(task.defectId != null){
          this.tandanService.updateDefect(task.tandan_id.toString(),task.defectId.toString(),(resDefect:TandanResponse)=>{
            this.loadingCtrl.getTop()?.then((v:HTMLIonLoadingElement)=>{
              v.dismiss();
            });
          });
        }else{
          this.loadingCtrl.getTop()?.then((v:HTMLIonLoadingElement)=>{
            v.dismiss();
          });
        }
      });
      this.storageService.set(this.storageService.controlPollinationOfflineData,tasks);
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
              if(el.status == TaskStatus.created){
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
      formData.append('_method','put');
      formData.append('catatan',task.catatan);
      formData.append('status',task.status);
      formData.append('berat_tandan',task.berat_tandan.toString());
      formData.append('id_sv_harvest',task.id_sv_harvest.toString());
      const response = await fetch(task.url_gambar_data);
      const blob = await response.blob();
      formData.append('url_gambar', blob, task.url_gambar);
      this.harvestService.update(task.id,formData,async (res:HarvestModel)=>{
        if(task.defectId != null){
          this.tandanService.updateDefect(task.tandan_id.toString(),task.defectId.toString(),(resDefect:TandanResponse)=>{
            this.loadingCtrl.getTop()?.then((v:HTMLIonLoadingElement)=>{
              v.dismiss();
            });
          });
        }else{
          this.loadingCtrl.getTop()?.then((v:HTMLIonLoadingElement)=>{
            v.dismiss();
          });
        }
      });
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
              if(el.status == TaskStatus.created){
                this.harvestList.push(el);
              }
            });
            this.loadingCtrl.getTop()?.then((v:HTMLIonLoadingElement)=>{
              v.dismiss();
            });
            this.storageService.set(this.storageService.offlineNewHarvest,this.harvestList);
            this.defectService.getAll((defectRes:[DefectModel])=>{
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

}
