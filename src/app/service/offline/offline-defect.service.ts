import { Injectable } from '@angular/core';
import { DefectModel } from 'src/app/model/defect';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class OfflineDefectService {

  constructor(
    private storageService:StorageService
  ) { }

  async getAll(){
    let retVal:DefectModel[] = await this.storageService.get(this.storageService.offlineDefectList);
    return retVal;
  }
}
