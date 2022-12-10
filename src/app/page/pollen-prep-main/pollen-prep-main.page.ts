import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InAppTaskCycle } from 'src/app/common/inapp-task-cycle';
import { TaskStatus } from 'src/app/common/task-status';
import { BaggingModel } from 'src/app/model/bagging';
import { LoginResponseModel } from 'src/app/model/login-response';
import { PollenPreparationModel } from 'src/app/model/pollen-preparation-model';
import { AccountService, UserRole } from 'src/app/service/account.service';
import { NavigationService } from 'src/app/service/navigation.service';
import { PollenPreparationService } from 'src/app/service/tasks/pollen-preparation.service';

@Component({
  selector: 'app-pollen-prep-main',
  templateUrl: './pollen-prep-main.page.html',
  styleUrls: ['./pollen-prep-main.page.scss'],
})
export class PollenPrepMainPage implements OnInit {

  disableFinishRecord:boolean;
  disableNewTaskBtn:boolean;
  disableNewRecord:boolean;
  disablePosponedTaskBtn:boolean;
  disableActiveTaskBtn:boolean;
  numOfActiveTask:number = 0;
  numOfFinishTask:number = 0;
  numOfPosponedTask:number = 0;
  numOfNewTask:number = 0;
  activeTaskList:any[];
  finishedTaskList:any[];
  newTaskList:any[];
  posponedTaskList:any[];
  role:UserRole;

  constructor(
    private router:Router,
    private pollenPrepService:PollenPreparationService,
    private accountService:AccountService,
    private navigationService:NavigationService,
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter(){
    let user:LoginResponseModel = this.accountService.getSessionDetails();
    this.role = this.accountService.getUserRole();
    this.activeTaskList = [];
    this.finishedTaskList = [];
    this.newTaskList = [];
    this.posponedTaskList = [];
    this.numOfActiveTask = 0;
    this.numOfFinishTask = 0;
    this.numOfPosponedTask = 0;
    this.numOfNewTask = 0;
    this._getTask();
    this._initButtons();
  }

  view(taskStatus:String){
    this._initButtons();
    if(taskStatus == 'new'){
      this.disableNewTaskBtn = true;
    }else if(taskStatus == 'posponed'){
      this.disablePosponedTaskBtn = true;
    }else if(taskStatus == 'active'){
      this.disableActiveTaskBtn = true;
    }else if(taskStatus == 'finished'){
      this.disableFinishRecord = true;
    }
  }

  _initButtons(){
    this.disableFinishRecord = false;
    this.disableNewTaskBtn = false;
    this.disablePosponedTaskBtn = false;
    this.disableActiveTaskBtn = false;
  }

  viewTask(taskStatus:String, id:String, value:String = ""){
    if(taskStatus == 'new'){
      this.router.navigate(['app/tabs/tab1/pollen-prep-tandan-list',{status:taskStatus,treeId:value}]);
    }else if(taskStatus == 'posponed'){
      this.router.navigate(['app/tabs/tab1/pollen-prep-form',{
        taskId:id,tandanId:value
      }]);
    }
    else{
      // this.router.navigate(['app/tabs/tab1/task-finished',{taskId:taskStatus,tandanId:id}]);
    }
  }

  _getTask(){
    if(this.role == UserRole.petugas_makmal){
      this._getNewTask();
    }else{
      this._getSvTask();
    }
  }

  _getSvTask(){
    this.pollenPrepService.getAll((res:[PollenPreparationModel])=>{
      res.forEach(el => {
        if(el.pengesah_id == this.accountService.getSessionDetails().no_kakitangan){
          if(el.status == TaskStatus.done){
            this.numOfNewTask++;
            this.newTaskList.push(el);
          }else if(el.status == TaskStatus.verified || el.status == TaskStatus.rejected){
            this.numOfFinishTask++;
            this.finishedTaskList.push(el);
          }
        }
      });
    });
  }
  
  newRecord(){
    this._enableAllBtn();
    this.disableNewRecord = true;
  }

  _enableAllBtn(){
    this.disableNewTaskBtn = false;
    this.disableFinishRecord = false;
    this.disableNewRecord = false;
    this.disableActiveTaskBtn = false;
  }

  _getNewTask(){
    this.pollenPrepService.getNewTask((res:[BaggingModel])=>{
      this.numOfNewTask = res.length;
      this.newTaskList = res;
      this._getPPTask();
    });
  }

  _getPPTask(){
    this.pollenPrepService.getAll(
      (res:[PollenPreparationModel])=>{
        res.forEach(el => {
          if(el.id_sv_pollen == this.accountService.getSessionDetails().id.toString()){
            if(el.status == TaskStatus.created){
              this.posponedTaskList.push(el);
              this.numOfPosponedTask++;
            }else if(el.status == TaskStatus.done){
              this.activeTaskList.push(el);
              this.numOfActiveTask++;
            }else{
              this.finishedTaskList.push(el);
              this.numOfFinishTask++;
            }
          }
        });
      }
    );
  }

}
