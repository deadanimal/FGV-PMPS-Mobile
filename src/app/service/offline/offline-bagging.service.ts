import { Injectable } from '@angular/core';
import { BaggingModel } from 'src/app/model/bagging';
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

  async saveRedoBaggingTask(task:OfflineBaggingModel){
    let currentTask = await this.storageService.get(this.storageService.redoBaggingOfflineData);
    if(currentTask == null){
      currentTask = [];
    }
    currentTask.push(task);
    this.storageService.set(this.storageService.redoBaggingOfflineData,currentTask);
    this._updateNewTask(task.id);
  }

  async _updateNewTask(removeId){
    let tempArr:BaggingModel[] = await this.storageService.get(this.storageService.posponedBaggingTask);
    let retArr:BaggingModel[] = [];
    tempArr.forEach(el => {
      if(el.id != removeId){
        retArr.push(el);
      }
    });
    this.storageService.set(this.storageService.posponedBaggingTask,retArr);
  }

  async getSavedBaggingTasks(){
    let retVal = await this.storageService.get(this.storageService.baggingOfflineData);
    return retVal;
  }

  async getSavedRedoBaggingTasks(){
    let retVal = await this.storageService.get(this.storageService.redoBaggingOfflineData);
    return retVal;
  }

  async getPosponedBaggingTasks(){
    let retVal = await this.storageService.get(this.storageService.posponedBaggingTask);
    return retVal;
  }
  async getPosponedBaggingTaskById(id:number){
    let tempArr:BaggingModel[] = await this.storageService.get(this.storageService.posponedBaggingTask);
    let retVal:BaggingModel;

    tempArr.forEach(el => {
      if(el.id == id){
        retVal = el;
      }
    });

    return retVal;
  }
}
