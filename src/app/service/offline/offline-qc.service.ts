import { Injectable } from '@angular/core';
import { QualityControlModel } from 'src/app/model/quality-control';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class OfflineQcService {

  constructor(
    private storageService:StorageService,
  ) { }

  async saveQCTask(task:QualityControlModel){
    let currentTask = await this.storageService.get(this.storageService.qcOfflineData);
    if(currentTask == null){
      currentTask = [];
    }
    currentTask.push(task);
    this.storageService.set(this.storageService.qcOfflineData,currentTask);
  }

  async getSavedQcTasks(){
    let retVal = await this.storageService.get(this.storageService.qcOfflineData);
    return retVal;
  }
}
