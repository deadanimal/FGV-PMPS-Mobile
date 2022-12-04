import { Injectable } from '@angular/core';
import { OfflineBaggingModel } from 'src/app/model/offline-bagging';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class OfflineBaggingService {

  constructor(
    private storageService:StorageService
  ) { }

  async saveBaggingTask(task:OfflineBaggingModel){
    let currentTask = await this.storageService.get(this.storageService.baggingOfflineData);
    if(currentTask == null){
      currentTask = [];
    }
    currentTask.push(task);
    this.storageService.set(this.storageService.baggingOfflineData,currentTask);
  }

  async getSavedBaggingTasks(){
    let retVal = await this.storageService.get(this.storageService.baggingOfflineData);
    return retVal;
  }
}
