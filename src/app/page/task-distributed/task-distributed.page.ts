import { Component, OnInit } from '@angular/core';
import { LoginResponseModel } from 'src/app/model/login-response';
import { User } from 'src/app/model/user';
import { AccountService, UserRole } from 'src/app/service/account.service';
import { HarvestService } from 'src/app/service/tasks/harvest.service';
import { QualityControlService } from 'src/app/service/tasks/quality-control.service';

@Component({
  selector: 'app-task-distributed',
  templateUrl: './task-distributed.page.html',
  styleUrls: ['./task-distributed.page.scss'],
})
export class TaskDistributedPage implements OnInit {


  qcWorker:User[] = [];
  harvestWorker:User[] = [];
  title:string;
  constructor(
    private accountService:AccountService,
    private harvestService:HarvestService,
    private qualityControlService:QualityControlService,
  ) { }

  ngOnInit() {
  }

  async ionViewDidEnter(){
    let user:LoginResponseModel = await this.accountService._getDataFromStorage();

    if(user.peranan == UserRole.penyelia_qc){
      this.title = UserRole.petugas_qc.toString();
    }else if(user.peranan == UserRole.penyelia_tuai){
      this.title = UserRole.petugas_tuai.toString();
    }
    this._getTask();
  }

  async _getTask(){
    let user:LoginResponseModel = await this.accountService._getDataFromStorage();
    if(user.peranan == UserRole.penyelia_qc){
      this.qualityControlService.getAllQcWorker((res:[User])=>{
        this.qcWorker = res;
      });
    }else{
      this.harvestService.getAllHarvestWorker((res:[User])=>{
      this.harvestWorker = res;
      });
    }
  }

}
