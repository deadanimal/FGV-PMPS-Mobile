import { Injectable } from '@angular/core';
import { BaggingModel } from '../model/bagging';
import { PokokResponse } from '../model/pokok-respons';
import { TandanResponse } from '../model/tandan-response';
import { StorageService } from './storage.service';
import { BaggingService } from './tasks/bagging.service';
import { TandanService } from './tasks/tandan.service';
import { TreeService } from './tasks/tree.service';

@Injectable({
  providedIn: 'root'
})
export class OfflineModeService {


  bagging:BaggingModel[] = [];
  tandanList:TandanResponse[] = [];
  treeList:PokokResponse[] = [];
  constructor(
    private storageService:StorageService,
    private tandanService:TandanService,
    private treeService:TreeService,
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

  sync(){
    this._syncBagging();
  }

  OfflineMode(state:boolean){
    this.storageService.set(this.storageService.offlineMode,state);
  }

  async isOfflineMode(){
    return await this.storageService.get(this.storageService.offlineMode);
  }

  private async _syncBagging(){
    //todo: upload existing data first
    this.treeService.getAll((res:[PokokResponse])=>{
      this.treeList = res;
      this.storageService.set(this.storageService.offlineTreeList,this.treeList);
      this.tandanService.getAll((res:[TandanResponse])=>{
        this.tandanList = [];
        res.forEach(el => {
          if(el.pokok_id == null){
            this.tandanList.push(el);
          }
        });
        this.storageService.set(this.storageService.offlineTandanList,this.tandanList);
      },true,'Fetching Tandan List');
    },'Fetching Tree List');
  }

}
