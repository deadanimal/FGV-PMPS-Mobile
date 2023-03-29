import { Injectable } from '@angular/core';
import { PokokResponse } from 'src/app/model/pokok-respons';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class OfflineTreeService {

  constructor(
    private storageService:StorageService,
  ) { }

  async getById(id:String){
    let tempArray:PokokResponse[] = await this.storageService.get(this.storageService.offlineTreeList);
    let retVal:PokokResponse;
    tempArray.forEach(el => {
      if(el.id.toString() == id){
        retVal = el;
      }
    });

    return retVal;
  }

  async getAll():Promise<PokokResponse[]>{
    let retVal:PokokResponse[] = await this.storageService.get(this.storageService.offlineTreeList);

    return retVal;
  }
}
