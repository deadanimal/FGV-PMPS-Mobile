import { Injectable } from '@angular/core';
import { TaskStatus } from 'src/app/common/task-status';
import { BaggingModel } from 'src/app/model/bagging';
import { ControlPollinationModel } from 'src/app/model/control-pollination';
import { OfflineControlPollinationModel } from 'src/app/model/offline-control-pollination';
import { StorageService } from '../storage.service';
import { OfflineTreeService } from './offline-tree.service';

@Injectable({
  providedIn: 'root'
})
export class OfflineControlPollinationService {

  constructor(
    private storageService:StorageService,
    private offlineTreeService:OfflineTreeService,
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

  async saveRedoCPTask(task:OfflineControlPollinationModel){
    let currentTask = await this.storageService.get(this.storageService.redoCPOfflineData);
    if(currentTask == null){
      currentTask = [];
    }
    currentTask.push(task);
    this.storageService.set(this.storageService.redoCPOfflineData,currentTask);
    this._updateRedoTask(task.id);
  }

  async savePosponedCPTask(task:OfflineControlPollinationModel){
    let currentTask = await this.storageService.get(this.storageService.posponedCPOfflineData);
    if(currentTask == null){
      currentTask = [];
    }
    currentTask.push(task);
    this.storageService.set(this.storageService.posponedCPOfflineData,currentTask);
    this._updateRedoTask(task.id);
  }

  async getSavedCPTasks():Promise<OfflineControlPollinationModel[]>{
    let retVal = await this.storageService.get(this.storageService.controlPollinationOfflineData);
    if(retVal == null){
      retVal = [];
    }
    return retVal;
  }

  async getSavedRedoCPTasks():Promise<OfflineControlPollinationModel[]>{
    let retVal = await this.storageService.get(this.storageService.redoCPOfflineData);
    return retVal;
  }

  async getSavedPosponed2CPTasks():Promise<OfflineControlPollinationModel[]>{
    let retVal = await this.storageService.get(this.storageService.posponedCPOfflineData);
    return retVal;
  }

  saveNewCpTasks(tasks:BaggingModel[]){
    this.storageService.set(this.storageService.offlineNewCp,tasks);
  }

  async getNewCpTaskList(){
    let retVal = await this.storageService.get(this.storageService.offlineNewCp);
    return retVal;
  }

  async getRejectedCpTaskList(){
    let retVal = await this.storageService.get(this.storageService.rejectedCPTask);
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

  async _updateRedoTask(removeTaskId){
    let tempArr:ControlPollinationModel[] = await this.storageService.get(this.storageService.rejectedCPTask);
    let retArr:ControlPollinationModel[] = [];
    tempArr.forEach(el => {
      if(el.id != removeTaskId){
        retArr.push(el);
      }
    });
    this.storageService.set(this.storageService.rejectedCPTask,retArr);
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

  async getPostponedTask():Promise<OfflineControlPollinationModel[]>{
    let retArray:OfflineControlPollinationModel[] = [];
    let tempArray:OfflineControlPollinationModel[] = await this.getSavedCPTasks();
    if(tempArray == null){
      tempArray = [];
    }

    tempArray.forEach(async el => {
      if(el.status == TaskStatus.created){
        let treeInfo = await this.offlineTreeService.getById(el.pokok_id);
        el.pokok = treeInfo;
        retArray.push(el);
      }
    });

    return retArray;
  }

  async getPostponedTaskById( taskId: string):Promise<OfflineControlPollinationModel>{
    let retVal:OfflineControlPollinationModel;
    let tempArray:OfflineControlPollinationModel[] = await this.getRejectedCpTaskList();
    if(tempArray == null){
      tempArray = [];
    }

    tempArray.forEach(async el => {
      if(el.id == taskId){
        retVal = el;
      }
    });
    console.log(retVal);
    console.log(tempArray);
    retVal.pokok = await this.offlineTreeService.getById(retVal.pokok_id);
    return retVal;
  }

  async getPostponedTaskByTandanId( tandanId: string):Promise<OfflineControlPollinationModel>{
    let retVal:OfflineControlPollinationModel;
    let tempArray:OfflineControlPollinationModel[] = await this.getSavedCPTasks();
    if(tempArray == null){
      tempArray = [];
    }

    tempArray.forEach(async el => {
      if(el.status == TaskStatus.created && el.tandan_id == tandanId){
        retVal = el;
      }
    });
    if(retVal != null){
      retVal.pokok = await this.offlineTreeService.getById(retVal.pokok_id);
    }
    return retVal;
  }

  async getRejectedTaskById( taskId: string):Promise<OfflineControlPollinationModel>{
    let retVal:OfflineControlPollinationModel;
    let tempArray:OfflineControlPollinationModel[] = await this.getRejectedCpTaskList();
    if(tempArray == null){
      tempArray = [];
    }

    tempArray.forEach(async el => {
      if(el.id == taskId){
        retVal = el;
      }
    });

    retVal.pokok = await this.offlineTreeService.getById(retVal.pokok_id);
    return retVal;
  }
}
