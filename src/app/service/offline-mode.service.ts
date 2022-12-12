import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { TandanCycle } from '../common/tandan-cycle';
import { BaggingModel } from '../model/bagging';
import { DefectModel } from '../model/defect';
import { OfflineBaggingModel } from '../model/offline-bagging';
import { OfflineControlPollinationModel } from '../model/offline-control-pollination';
import { PokokResponse } from '../model/pokok-respons';
import { TandanResponse } from '../model/tandan-response';
import { User } from '../model/user';
import { AccountService, UserRole } from './account.service';
import { OfflineBaggingService } from './offline/offline-bagging.service';
import { OfflineControlPollinationService } from './offline/offline-control-pollination.service';
import { StorageService } from './storage.service';
import { BaggingService } from './tasks/bagging.service';
import { ControlPollinationService } from './tasks/control-pollination.service';
import { DefectService } from './tasks/defect.service';
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
  defectList:DefectModel[] = [];
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

  sync(){
    this._syncBaggingAndCp();
  }

  OfflineMode(state:boolean){
    this.storageService.set(this.storageService.offlineMode,state);
  }

  async isOfflineMode(){
    return await this.storageService.get(this.storageService.offlineMode);
  }

  async _uploadBaggingTasks(){
    let tasks:OfflineBaggingModel[] = await this.offlineBaggingService.getSavedBaggingTasks();
    while(tasks.length > 0){
      let task:OfflineBaggingModel = tasks.pop();
      var formData = new FormData();

      for ( var key in task ) {
        if(key != 'url_gambar_data' && key != 'url_gambar'){
          formData.append(key, task[key]);
        }
      }

      const response = await fetch(task.url_gambar_data);
      const blob = await response.blob();
      formData.append('url_gambar', blob, task.url_gambar);
      this.baggingService.createTask(formData,async (res:BaggingModel)=>{},false);
      this.storageService.set(this.storageService.baggingOfflineData,tasks);
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

  private _syncBaggingAndCp(){
    this._uploadBaggingTasks();
    this._uploadCPTasks();
    this.treeService.getAll((res:[PokokResponse])=>{
      this.treeList = res;
      this.storageService.set(this.storageService.offlineTreeList,this.treeList);
      this.tandanService.getAll((res2:[TandanResponse])=>{
        this.tandanList = [];
        res2.forEach(el => {
          if(el.pokok_id == null || el.kitaran == TandanCycle.bagging){
            this.tandanList.push(el);
          }
        });
        this.storageService.set(this.storageService.offlineTandanList,this.tandanList);
        this.userService.getByRole(UserRole.penyelia_balut,(res3:[User])=>{
          this.baggingSvList = res3;
          this.storageService.set(this.storageService.baggingSvList,this.baggingSvList);
          this.controlPollinationService.getNewlyCreatedTask(
            this.accountService.getSessionDetails().id,
            (res1:[BaggingModel])=>{
            this.newCpTaskList = res1;
            this.storageService.set(this.storageService.offlineNewCp,this.newCpTaskList);
            this.defectService.getAll((defectRes:[DefectModel])=>{
              this.defectList = defectRes;
              this.storageService.set(this.storageService.offlineDefectList,defectRes);
              this.loadingCtrl.getTop()?.then((v:HTMLIonLoadingElement)=>{
                v.dismiss();
              });
            });
          },false);
        },'Fetching Supervisor List');
      },true,'Fetching Tandan List');
    },'Fetching Tree List');
  }

}
