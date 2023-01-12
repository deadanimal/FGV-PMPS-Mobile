import { Injectable } from '@angular/core';
import { TandanResponse } from 'src/app/model/tandan-response';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class OfflineTandanService {

  constructor(
    private storageService:StorageService
  ) { }

  async getById(id:number){
    let tempArray:TandanResponse[] = await this.storageService.get(this.storageService.offlineTandanList);
    let retVal:TandanResponse;
    tempArray.forEach(el => {
      if(el.id == id){
        retVal = el;
      }
    });

    return retVal;
  }

  async getAll(){
    let retVal:TandanResponse[] = await this.storageService.get(this.storageService.offlineTandanList);

    return retVal;
  }

  async updateTreeId(tandanId,treeId){
    let tempArray:TandanResponse[] = await this.storageService.get(this.storageService.offlineTandanList);
    tempArray.forEach(el => {
      if(el.id == tandanId){
        el.pokok_id = treeId;
      }
    });
    await this.storageService.set(this.storageService.offlineTandanList,tempArray);
  }
}
