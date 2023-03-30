import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InAppTaskCycle } from 'src/app/common/inapp-task-cycle';
import { DefectModel } from 'src/app/model/defect';
import { OfflineModeService } from 'src/app/service/offline-mode.service';
import { OfflineDefectService } from 'src/app/service/offline/offline-defect.service';
import { DefectService } from 'src/app/service/tasks/defect.service';

@Component({
  selector: 'app-defect',
  templateUrl: './defect.page.html',
  styleUrls: ['./defect.page.scss'],
})
export class DefectPage implements OnInit {

  defect:number = 100000;
  taskType:String;
  taskId:String;
  tandanId:String;
  taskStatus:String;
  returnPage:String;
  defectList:DefectModel[] = [];
  isOfflineMode = false;
  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private defectService: DefectService,
    private offlineModeService:OfflineModeService,
    private offlineDefectService:OfflineDefectService,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
        this.taskType = params['taskType'];
        this.taskId = params['taskId'];
        this.tandanId = params['tandanId'];
        this.taskStatus = params['taskStatus'];
        this.returnPage = params['returnPage'];
    });
  }

  async ionViewDidEnter(){
    this.isOfflineMode = await this.offlineModeService.isOfflineMode();
    this._getDefect();
  }

  async _getDefect(){
    if(!this.isOfflineMode){
      this.defectService.getAll((res:[DefectModel])=>{
        res.forEach(el => {
          this.defectList.push(el);
        });
      });
    }else{
      this.defectList = await this.offlineDefectService.getAll();
    }
  }

  handleChange(e) {
    this.defect = e.detail.value;
  }

  continue(){
    let path = '';
    if(this.taskType == InAppTaskCycle.pp){
      path = 'app/tabs/tab1/task-status';
    }else{
      path = 'app/tabs/tab1/task-status';
    }
    this.router.navigate(
      [
        path,
        {
          tandanId:this.tandanId,
          taskId:this.taskId,
          taskType:this.taskType,
          tandanStatus:'ok',
          returnPage:this.returnPage,
        }
      ]
    );
  }

  reject(){
    let path = '';
    if(this.taskType == InAppTaskCycle.pp){
      path = 'app/tabs/tab1/task-status';
    }else{
      path = 'app/tabs/tab1/task-status';
    }
    this.router.navigate(
      [
        path,
        {
          tandanId:this.tandanId,
          taskId:this.taskId,
          taskType:this.taskType,
          tandanStatus:'nok',
          returnPage:this.returnPage,
          defect:this.defect,
        }
      ]
    );
  }

}
