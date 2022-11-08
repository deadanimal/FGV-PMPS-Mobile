import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { UserSelection } from 'src/app/component/scanner-prompt/scanner-prompt.component';
import { LoginResponseModel } from 'src/app/model/login-response';
import { TaskResponseModel } from 'src/app/model/task-response';
import { AccountService } from 'src/app/service/account.service';
import { ModalService } from 'src/app/service/modal.service';
import { TaskService } from 'src/app/service/task.service';

@Component({
  selector: 'app-main-task',
  templateUrl: './main-task.page.html',
  styleUrls: ['./main-task.page.scss'],
})
export class MainTaskPage implements OnInit {

  task:String;
  disableFinishRecord:boolean;
  disableNewRecord:boolean;
  disableNewTaskBtn:boolean;
  disableTaskBtn:boolean;
  disableActiveTaskBtn:boolean;
  role:String;
  taskIconPath:String;
  taskBtnName:String;
  numOfActiveTask:number = 0;
  numOfFinishTask:number = 0;
  numOfNewTask:number = 0;
  employeeId:String;
  scanInput:String;
  loadingModal:any;
  hasNewTask:boolean = false;
  activeTaskList:TaskResponseModel[];
  finishedTaskList:TaskResponseModel[];
  newTaskList:TaskResponseModel[];

  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private accountService:AccountService,
    private taskService:TaskService,
    private loadingCtrl: LoadingController,
    private modalService: ModalService,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if(params['task']!=null){
        this.task = params['task'];
        if(params['task'] == "wrap"){
          this.task = "Balut";
          this.taskBtnName = "Balut";
          this.taskIconPath = "../../../assets/balut_icon.png";
        }else if(params['task'] == "cp"){
          this.task = "Pendebungaan Terkawal (CP)";
          this.taskBtnName = "CP";
          this.taskIconPath = "../../../assets/cp_icon.png";
        }else if(params['task'] == "Kawalan Kualiti (QC)"){
          this.taskBtnName = "QC";
          this.taskIconPath = "../../../assets/qc_icon.png";
        }
        else if(params['task'] == "Tuai"){
          this.taskBtnName = "Tuai";
          this.taskIconPath = "../../../assets/tuai_icon.png";
        }
      }
      if(params['scanInput']!=null){
        this.scanInput = params['scanInput'];
       }
    });

    let user:LoginResponseModel = this.accountService.getSessionDetails();
    this.role = user.peranan;
    this.employeeId = user.no_kakitangan;
  }

  ionViewWillEnter() {
    this.numOfActiveTask = 0;
    this.numOfFinishTask = 0;
    this.numOfNewTask = 0;
    this._getTask();
  }

  viewTask(taskId:String,status:String,id:number){
    if(status == "newTask"){
      this.router.navigate(['app/tabs/tab1/new-task',{taskId:id}]);
    }else if(status == "completed"){
      this.router.navigate(['app/tabs/tab1/task-finished',{taskId:taskId,tandanId:id}]);
    }else if(status == "activeTask"){
      this.router.navigate(['app/tabs/tab1/task-finished',{taskId:taskId,tandanId:id}]);
    }else if(status == "activeTaskSV"){
      this.router.navigate(['app/tabs/tab1/task-status',{taskId:id}]);
    }else if(status == "createNewTask"){
      this.router.navigate(['app/tabs/tab1/create-new-task',{taskType:this.task}]);
    }else if(status == "overdueTask"){
      this.router.navigate(['app/tabs/tab1/defect',{taskType:this.task}]);
    }
  }

  activeTask(){
    this._enableAllBtn();
    this.disableActiveTaskBtn = true;
  }

  newRecord(){
    this._enableAllBtn();
    this.disableNewRecord = true;
  }

  finishRecord(){
    this._enableAllBtn();
    this.disableFinishRecord = true;
  }

  runTask(){
    this._enableAllBtn();
    // this.disableTaskBtn = true;
    this._promptQrScan();
  }

  _promptQrScan(){
    this.modalService.qrPrompt("No Pokok").then(
      (value)=>{
        let sel:UserSelection;
        sel = value['data'];
        if(sel == UserSelection.manual){
          this._manualInput();
        }else{
          this.router.navigate(
            [
              '/app/tabs/tab2',
              {
                returnUrl:"app/tabs/tab1/main-task"
              }
            ],
            {
              replaceUrl : true
            }
          );
        }
    });
  }

  _proceedToWork(){
    this.router.navigate(
      [
        '/app/tabs/tab1/start-work-find',
        {
          treeNum:this.scanInput,
          taskType:this.task,
        }
      ],
      {
        replaceUrl : true
      }
    );
  }

  _manualInput(){
    this.modalService.singleInput("No Pokok").then(
      (value)=>{
        let form:NgForm;
        form = value['data'];
        this.scanInput = form.value.value;
        if(this.scanInput!=null && this.scanInput != ""){
          this._proceedToWork();
        }
      }
    );
  }

  newTask(){
    this._enableAllBtn();
    this.disableNewTaskBtn = true;
    this.viewTask('cp','createNewTask',0);
  }

  _enableAllBtn(){
    this.disableNewTaskBtn = false;
    this.disableFinishRecord = false;
    this.disableNewRecord = false;
    this.disableTaskBtn = false;
    this.disableActiveTaskBtn = false;
  }

  _populateData(res:[TaskResponseModel]){
    if(res.length > 0){
      res.forEach(element => {
        let countThis:boolean = false;
        if(element.jenis == "balut" && this.task == "Balut"){
          countThis = true;
        }else if(element.jenis == "debung" && this.task == "Pendebungaan Terkawal (CP)"){
          countThis = true;
        }else if(element.jenis == "kawal" && this.task == "Kawalan Kualiti (QC)"){
          countThis = true;
        }else if(element.jenis == "tuai" && this.task == "Tuai"){
          countThis = true;
        }
        if(countThis){
          if(element.status == "siap"){
            this.numOfActiveTask++;
            this.activeTaskList.push(element);
          }else if(element.status == "sah"){
            this.numOfFinishTask++;
            this.finishedTaskList.push(element);
          }else if(element.status == "dicipta"){
            this.numOfNewTask++;
            this.newTaskList.push(element);
            this.hasNewTask = true;
          }
        }
      });
    }else{
    }
  }

  async _getTask(){
    this.loadingModal= await this.showLoading();
    this.activeTaskList = [];
    this.finishedTaskList = [];
    this.newTaskList = [];
    if(this.role == "pekerja"){
      this.taskService.getTaskById(this.employeeId).subscribe(
        (res:[TaskResponseModel]) => {
          this.loadingModal.dismiss();
          this._populateData(res);
        },
        (err:HttpErrorResponse) => {
          this.loadingModal.dismiss();
        }
      );
    }else{
      this.taskService.getAllTask().subscribe(
        (res:[TaskResponseModel]) => {
          this.loadingModal.dismiss();
          this._populateData(res);
        },
        (err:HttpErrorResponse) => {
          this.loadingModal.dismiss();
        }
      );
    }
  }

  async showLoading():Promise<HTMLIonLoadingElement> {
    const loading = await this.loadingCtrl.create();
    loading.present();
    return loading;
  }

}
