import { Injectable } from '@angular/core';
import { BaggingModel } from 'src/app/model/bagging';
import { OfflineControlPollinationModel } from 'src/app/model/offline-control-pollination';
import { StorageService } from '../storage.service';
import { BaggingService } from '../tasks/bagging.service';

@Injectable({
  providedIn: 'root'
})
export class OfflineControlPollinationService {

  constructor(
    private storageService:StorageService
  ) { }

  async saveCPTask(task:OfflineControlPollinationModel){
    let currentTask = await this.storageService.get(this.storageService.controlPollinationOfflineData);
    if(currentTask == null){
      currentTask = [];
    }
    currentTask.push(task);
    this.storageService.set(this.storageService.controlPollinationOfflineData,currentTask);
    this._updateNewTask(task.tandan_id);
  }

  async getSavedCPTasks():Promise<OfflineControlPollinationModel[]>{
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

  async _updateNewTask(removeTandan){
    let tempArr:BaggingModel[] = await this.storageService.get(this.storageService.offlineNewCp);
    let retArr:BaggingModel[] = [];
    tempArr.forEach(el => {
      if(el.tandan_id != removeTandan){
        retArr.push(el);
      }
    });
    this.storageService.set(this.storageService.offlineNewCp,retArr);
  }

  async getNewTaskById(id:number){
    let tempArr:BaggingModel[] = await this.storageService.get(this.storageService.offlineNewCp);
    let retVal:BaggingModel;

    tempArr.forEach(el => {
      if(el.id == id){
        retVal = el;
      }
    });

    return retVal;
  }
}
