import { Injectable } from '@angular/core';
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

  constructor(
    private storageService:StorageService,
    private tandanService:TandanService,
    private baggingService:BaggingService,
    private treeService:TreeService,
  ) { }

  sync(){
    this._syncBagging();
  }

  OfflineMode(state:boolean){
    this.storageService.set(this.storageService.offlineMode,state);
  }

  async isOfflineMode(){
    return await this.storageService.get(this.storageService.offlineMode);
  }

  private _getOfflineBaggingData(){

  }

  private _getOfflineTandanData(offlineData:any){
    this.tandanService.getAll((res:[TandanResponse])=>{
      offlineData.tandanList = [];
      res.forEach(el => {
        if(el.pokok_id == null){
          offlineData.tandanList.push(el);
        }
      });
    },true,'Fetching Tandan List');
  }

  private _getOfflineTreeData(offlineData:any){
    this.treeService.getAll((res:[PokokResponse])=>{
      offlineData.treeList = res;
      this._getOfflineTandanData(offlineData);
    },'Fetching Tree List');
  }

  private async _syncBagging(){
    //todo: upload existing data first
    let offlineData:Object = new Object();
    this._getOfflineTreeData(offlineData);
  }

}
