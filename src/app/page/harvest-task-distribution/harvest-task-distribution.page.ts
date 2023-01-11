import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { TaskStatus } from 'src/app/common/task-status';
import { ControlPollinationModel } from 'src/app/model/control-pollination';
import { HarvestModel } from 'src/app/model/harvest';
import { User } from 'src/app/model/user';
import { AccountService } from 'src/app/service/account.service';
import { ModalService } from 'src/app/service/modal.service';
import { BaggingService } from 'src/app/service/tasks/bagging.service';
import { HarvestService } from 'src/app/service/tasks/harvest.service';

@Component({
  selector: 'app-harvest-task-distribution',
  templateUrl: './harvest-task-distribution.page.html',
  styleUrls: ['./harvest-task-distribution.page.scss'],
})
export class HarvestTaskDistributionPage implements OnInit {

  taskId:String;
  taskIdCycle:String;
  treeId:number;
  tandanId:number;
  qcWorker:User[] = [];
  constructor(
    private activatedRoute:ActivatedRoute,
    private modalService:ModalService,
    private baggingService:BaggingService,
    private accountService:AccountService,
    private harvestService:HarvestService,
    private navCtrl:NavController,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.taskId = params['taskId'];
      this.taskIdCycle = params['taskIdCycle'];
    });
  }

  ionViewDidEnter(){
    this._getTask();
  }

  _getTask(){
    this.harvestService.getAllHarvestWorker((res:[User])=>{
      this.qcWorker = res;
      this.baggingService.getById(this.taskId,(resCP:ControlPollinationModel)=>{
        this.tandanId = resCP.tandan_id;
        this.treeId = resCP.pokok_id;
      });
    });
  }

  select(userId:number){
    const formData = new FormData();
    formData.append('pokok_id',this.treeId.toString());
    formData.append('tandan_id',this.tandanId.toString());
    formData.append('id_sv_harvest',userId.toString());
    formData.append('status',TaskStatus.created);
    formData.append('pengesah_id',this.accountService.getSessionDetails().id.toString());
    this.harvestService.create(formData,(res:HarvestModel)=>{
      this.modalService.successPrompt("Anda telah mengagihkan tugas kepada pekerja yang dipilih").then(()=>{
        this.navCtrl.back();
      });
    });
  }

}
