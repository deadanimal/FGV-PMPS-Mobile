import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pollen-prep-main',
  templateUrl: './pollen-prep-main.page.html',
  styleUrls: ['./pollen-prep-main.page.scss'],
})
export class PollenPrepMainPage implements OnInit {

  disableFinishRecord:boolean;
  disableNewTaskBtn:boolean;
  disablePosponedTaskBtn:boolean;
  disableActiveTaskBtn:boolean;
  numOfActiveTask:number = 1;
  numOfFinishTask:number = 1;
  numOfPosponedTask:number = 1;
  numOfNewTask:number = 1;

  constructor(
    private router:Router
  ) { }

  ngOnInit() {
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

  viewTask(taskStatus:String, id:String){
    this.router.navigate(['app/tabs/tab1/pollen-prep-tandan-list',{status:taskStatus}]);
  }

}
