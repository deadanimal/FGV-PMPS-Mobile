import { Injectable } from '@angular/core';
import { HarvestModel } from 'src/app/model/harvest';
import { OfflineHarvestModel } from 'src/app/model/offline-harvest';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class OfflineHarvestService {

  constructor(
    private storageService:StorageService,
  ) { }

  async saveQCTask(task:OfflineHarvestModel){
    let currentTask = await this.storageService.get(this.storageService.harvestOfflineData);
    if(currentTask == null){
      currentTask = [];
    }
    currentTask.push(task);
    this.storageService.set(this.storageService.harvestOfflineData,currentTask);
    this._updateNewTask(task.tandan_id);
  }

  async getSavedQcTasks(){
    let retVal = await this.storageService.get(this.storageService.harvestOfflineData);
    return retVal;
  }

  async getNewQCTaskList(){
    let retVal = await this.storageService.get(this.storageService.offlineNewHarvest);
    return retVal;
  }

  async _updateNewTask(removeTandan){
    let tempArr:HarvestModel[] = await this.storageService.get(this.storageService.offlineNewHarvest);
    let retArr:HarvestModel[];
    tempArr.forEach(el => {
      if(el.tandan_id != removeTandan){
        retArr.push(el);
      }
    });
    this.storageService.set(this.storageService.offlineNewHarvest,retArr);
  }

  async getNewTaskById(id:number){
    let tempArr:HarvestModel[] = await this.storageService.get(this.storageService.offlineNewHarvest);
    let retVal:HarvestModel;

    tempArr.forEach(el => {
      if(el.id == id){
        retVal = el;
      }
    });

    return retVal;
  }
}
