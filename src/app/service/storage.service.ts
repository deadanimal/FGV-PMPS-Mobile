import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  loginDetail:string = "loginDetail";
  language:string = "lang";
  offlineData:string = "offlineData";
  offlineMode:string = "offlineMode";
  offlineTreeList:string = "offlineTree";
  offlineTandanList:string = "offlineTandan";
  baggingSvList:string = "offlineBaggingSv";
  offlineNewCp:string = "offlineNewCp";
  offlineDefectList:string = "offlineDefectList";
  baggingOfflineData:string = "baggingOffline";
  redoBaggingOfflineData:string = "redoBaggingOfflineData";
  controlPollinationOfflineData:string = "cpOffline";
  offlineNewQc:string = "offlineNewQc";
  qcOfflineData:string = "qcOffline";
  offlineNewHarvest:string = "offlineNewHarvest";
  harvestOfflineData:string = "harvestOfflineData";
  posponedBaggingTask:string = "posponedBaggingTask";

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  public set(key: string, value: any) {
    return this._storage?.set(key, value);
  }

  public get(key: string) {
    return this._storage?.get(key);
  }

  public async eraseAll(){
    await this._storage?.clear();
  }
}