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
  controlPollinationOfflineData:string = "cpOffline";
  offlineNewQc:string = "offlineNewQc";
  qcOfflineData:string = "qcOffline";

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  public set(key: string, value: any) {
    this._storage?.set(key, value);
  }

  public get(key: string) {
    return this._storage?.get(key);
  }

  public async eraseAll(){
    await this._storage?.clear();
  }
}