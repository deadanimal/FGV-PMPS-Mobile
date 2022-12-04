import { Injectable } from '@angular/core';
import { User } from 'src/app/model/user';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class OfflineUserService {

  constructor(
    private storageService:StorageService,
  ) { }

  async getBaggingSv(){
    let retVal:User[] = await this.storageService.get(this.storageService.baggingSvList);
    return retVal;
  }
}
