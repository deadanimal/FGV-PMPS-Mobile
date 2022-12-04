import { Injectable } from '@angular/core';
import { BaggingModel } from '../model/bagging';
import { PokokResponse } from '../model/pokok-respons';
import { TandanResponse } from '../model/tandan-response';
import { User } from '../model/user';
import { AccountService, UserRole } from './account.service';
import { StorageService } from './storage.service';
import { ControlPollinationService } from './tasks/control-pollination.service';
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
  constructor(
    private storageService:StorageService,
    private tandanService:TandanService,
    private treeService:TreeService,
    private userService:UserService,
    private controlPollinationService:ControlPollinationService,
    private accountService:AccountService,
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

  private async _syncBaggingAndCp(){
    //todo: upload existing data first
    this.treeService.getAll((res:[PokokResponse])=>{
      this.treeList = res;
      this.storageService.set(this.storageService.offlineTreeList,this.treeList);
      this.tandanService.getAll((res2:[TandanResponse])=>{
        this.tandanList = [];
        res2.forEach(el => {
          if(el.pokok_id == null){
            this.tandanList.push(el);
          }
        });
        this.storageService.set(this.storageService.offlineTandanList,this.tandanList);
        this.userService.getByRole(UserRole.penyelia_balut,(res3:[User])=>{
          this.baggingSvList = res3;
          this.storageService.set(this.storageService.baggingSvList,this.baggingSvList);
          this.controlPollinationService.getNewlyCreatedTask(
            this.accountService.getSessionDetails().id.toString(),
            (res1:[BaggingModel])=>{
            this.newCpTaskList = res1;
          },false);
        },'Fetching Supervisor List');
      },true,'Fetching Tandan List');
    },'Fetching Tree List');
  }

}
