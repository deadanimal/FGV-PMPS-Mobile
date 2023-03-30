import { Injectable } from '@angular/core';
import { PollenPreparationModel } from 'src/app/model/pollen-preparation-model';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class OfflinePollenPrepService {

  constructor(
    private storageService:StorageService
  ) { }

  async getAll(){
    let retVal:PollenPreparationModel[] = await this.storageService.get(this.storageService.pollenPrep);

    return retVal;
  }
}
