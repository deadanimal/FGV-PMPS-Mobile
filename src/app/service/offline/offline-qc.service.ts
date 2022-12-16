import { Injectable } from '@angular/core';
import { OfflineQualityControlModel } from 'src/app/model/offline-quality-control';
import { QualityControlModel } from 'src/app/model/quality-control';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class OfflineQcService {

  constructor(
    private storageService:StorageService,
  ) { }

  async saveQCTask(task:OfflineQualityControlModel){
    let currentTask = await this.storageService.get(this.storageService.qcOfflineData);
    if(currentTask == null){
      currentTask = [];
    }
    currentTask.push(task);
    this.storageService.set(this.storageService.qcOfflineData,currentTask);
    this._updateNewTask(task.tandan_id);
  }

  async getSavedQcTasks(){
    let retVal = await this.storageService.get(this.storageService.qcOfflineData);
    return retVal;
  }

  async getNewQCTaskList(){
    let retVal = await this.storageService.get(this.storageService.offlineNewQc);
    return retVal;
  }

  async _updateNewTask(removeTandan){
    let tempArr:QualityControlModel[] = await this.storageService.get(this.storageService.offlineNewQc);
    let retArr:QualityControlModel[] = [];
    tempArr.forEach(el => {
      if(el.tandan_id != removeTandan){
        retArr.push(el);
      }
    });
    this.storageService.set(this.storageService.offlineNewQc,retArr);
  }

  async getNewTaskById(id:number){
    let tempArr:QualityControlModel[] = await this.storageService.get(this.storageService.offlineNewQc);
    let retVal:QualityControlModel;

    tempArr.forEach(el => {
      if(el.id == id){
        retVal = el;
      }
    });

    return retVal;
  }
}
