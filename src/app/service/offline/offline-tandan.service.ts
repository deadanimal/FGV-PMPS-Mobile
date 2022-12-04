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

  async getById(id:String){
    let tempArray:TandanResponse[] = await this.storageService.get(this.storageService.offlineTandanList);
    let retVal:TandanResponse;
    tempArray.forEach(el => {
      if(el.id.toString() == id){
        retVal = el;
      }
    });

    return retVal;
  }
}
