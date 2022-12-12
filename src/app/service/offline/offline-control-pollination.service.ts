import { Injectable } from '@angular/core';
import { BaggingModel } from 'src/app/model/bagging';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class OfflineControlPollinationService {

  constructor(
    private storageService:StorageService
  ) { }

  async saveBaggingTask(task){
    let currentTask = await this.storageService.get(this.storageService.controlPollinationOfflineData);
    if(currentTask == null){
      currentTask = [];
    }
    currentTask.push(task);
    this.storageService.set(this.storageService.controlPollinationOfflineData,currentTask);
  }

  async getSavedBaggingTasks(){
    let retVal = await this.storageService.get(this.storageService.controlPollinationOfflineData);
    return retVal;
  }

  saveNewCpTasks(tasks:BaggingModel[]){
    this.storageService.set(this.storageService.offlineNewCp,tasks);
  }

  async getNewCpTaskList(){
    let retVal = await this.storageService.get(this.storageService.offlineNewCp);
    return retVal;
  }
}
