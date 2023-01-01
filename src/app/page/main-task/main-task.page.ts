import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { InAppTaskCycle } from 'src/app/common/inapp-task-cycle';
import { TaskStatus } from 'src/app/common/task-status';
import { UserSelection } from 'src/app/component/scanner-prompt/scanner-prompt.component';
import { BaggingModel } from 'src/app/model/bagging';
import { ControlPollinationModel } from 'src/app/model/control-pollination';
import { HarvestModel } from 'src/app/model/harvest';
import { LoginResponseModel } from 'src/app/model/login-response';
import { PokokResponse } from 'src/app/model/pokok-respons';
import { PollenPreparationModel } from 'src/app/model/pollen-preparation-model';
import { QualityControlModel } from 'src/app/model/quality-control';
import { TaskResponseModel } from 'src/app/model/task-response';
import { AccountService, UserRole } from 'src/app/service/account.service';
import { ModalService } from 'src/app/service/modal.service';
import { OfflineModeService } from 'src/app/service/offline-mode.service';
import { OfflineBaggingService } from 'src/app/service/offline/offline-bagging.service';
import { OfflineControlPollinationService } from 'src/app/service/offline/offline-control-pollination.service';
import { OfflineHarvestService } from 'src/app/service/offline/offline-harvest.service';
import { OfflineQcService } from 'src/app/service/offline/offline-qc.service';
import { OfflineTreeService } from 'src/app/service/offline/offline-tree.service';
import { TaskService } from 'src/app/service/task.service';
import { BaggingService } from 'src/app/service/tasks/bagging.service';
import { ControlPollinationService } from 'src/app/service/tasks/control-pollination.service';
import { HarvestService } from 'src/app/service/tasks/harvest.service';
import { PollenPreparationService } from 'src/app/service/tasks/pollen-preparation.service';
import { QualityControlService } from 'src/app/service/tasks/quality-control.service';
import { TreeService } from 'src/app/service/tasks/tree.service';

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
  disablePostponedTaskBtn:boolean;
  role:UserRole;
  taskIconPath:String;
  taskBtnName:String;
  numOfActiveTask:number = 0;
  numOfFinishTask:number = 0;
  numOfNewTask:number = 0;
  numOfPosponedTask:number = 0;
  employeeId:number;
  scanInput:String;
  loadingModal:any;
  hasNewTask:boolean = false;
  activeTaskList:any[];
  finishedTaskList:any[];
  newTaskList:any[];
  posponedTaskList:any[];
  isOfflineMode = false;

  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private accountService:AccountService,
    private taskService:TaskService,
    private loadingCtrl: LoadingController,
    private modalService: ModalService,
    private baggingService:BaggingService,
    private controlPollinationService:ControlPollinationService,
    private qcService:QualityControlService,
    private harvestService:HarvestService,
    private treeService:TreeService,
    private offlineModeService:OfflineModeService,
    private offlineTreeService:OfflineTreeService,
    private offlineBaggingService:OfflineBaggingService,
    private offlineCPService:OfflineControlPollinationService,
    private pollenPrepService:PollenPreparationService,
    private offlineQCService:OfflineQcService,
    private offlineHarvestService:OfflineHarvestService,
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
        this.scanInput = params['scanInput']; // this is tree id
       }
    });

    let user:LoginResponseModel = this.accountService.getSessionDetails();
    this.role = this.accountService.getUserRole();
    this.employeeId = user.id;
  }

  async ionViewDidEnter() {
    this.numOfActiveTask = 0;
    this.numOfFinishTask = 0;
    this.numOfNewTask = 0;
    this.numOfPosponedTask = 0;
    this.isOfflineMode = await this.offlineModeService.isOfflineMode();
    this._getTask();
    if(this.scanInput != null){
      if(!this.isOfflineMode){
        this.treeService.getById(this.scanInput,(res:PokokResponse)=>{
          this._manualInput(res.progeny+"-"+res.no_pokok);
        },false);
      }else{
        let treeNumber = await this.offlineTreeService.getById(this.scanInput);
        this._manualInput(treeNumber.progeny+"-"+treeNumber.no_pokok);
      }
    }
  }

  viewTask(taskId:String,status:String,id:number,param1:string = ""){
    if(status == "completed"){
      this.router.navigate(['app/tabs/tab1/task-finished',{taskId:taskId,tandanId:id}]);
    }else if( status == 'posponed'){
      if(taskId == 'cp'){
        this.router.navigate(['/app/tabs/tab1/reg-status',
        {
          taskId:id,
          treeNum:param1,
          taskType:this.task+"posponed",
        }]);
      }
    }else if( status == 'interrupted'){
      if(taskId == 'cp'){
        this.router.navigate(['/app/tabs/tab1/reg-status',
        {
          taskId:id,
          tandanId:param1,
          taskType:this.task+"interrupted",
        }]);
      }
    }else if(status == "activeTask"){
      this.router.navigate(['app/tabs/tab1/task-finished',{taskId:taskId,tandanId:id}]);
    }else if(status == "activeTaskSV"){
      if(taskId == "cp"){
        this.router.navigate(['/app/tabs/tab1/reg-status',
        {
          taskId:id,
          treeNum:param1,
          taskType:this.task,
        }]);
      }else if(taskId == "qc"){
        this.router.navigate(['/app/tabs/tab1/reg-status',
        {
          taskId:id,
          treeNum:param1,
          taskType:this.task,
        }]);
      }else if(taskId == "qcSv"){
        this.router.navigate(
          [
            'app/tabs/tab1/task-status',
            {
              taskId:id,
              taskType:InAppTaskCycle.qcSv
            }
          ]
        );
      }else if(taskId == "harvestSv"){
        this.router.navigate(
          [
            'app/tabs/tab1/task-status',
            {
              taskId:id,
              taskType:'harvestsv'
            }
          ]
        );
      }else if(taskId == "harvest"){
        this.router.navigate(['/app/tabs/tab1/reg-status',
        {
          taskId:id,
          treeNum:param1,
          taskType:this.task,
        }]);
      }else if(taskId == "pollenPrep"){
        this.router.navigate(['app/tabs/tab1/task-status',
        {
          taskId:id,
          taskType:InAppTaskCycle.ppSv,
          tandanId:param1,
        }]);
      }else{
        this.router.navigate(
          [
            'app/tabs/tab1/task-status',
            {
              taskId:id,
              taskType:this.task == 'Pendebungaan Terkawal (CP)'? 'debung' : this.task
            }
          ]
        );
      }
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
  
  posponedTask(){
    this._enableAllBtn();
    this.disablePostponedTaskBtn = true;
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

  newCPTask(){
    this._enableAllBtn();
    this.disableNewRecord = true;
  }

  _promptQrScan(){
    this.modalService.qrPrompt("No Pokok").then(
      (value)=>{
        let sel:UserSelection;
        sel = value['data'];
        if(sel == UserSelection.manual){
          this._manualInput();
        }else if(sel == UserSelection.qr_scan){
          this.router.navigate(
            [
              '/app/tabs/tab2',
              {
                returnUrl:"app/tabs/tab1/main-task",
                task:this.task,
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
      ]
    );
  }

  _manualInput(defaultValue=""){
    this.modalService.singleInput("No Pokok",defaultValue).then(
      (value)=>{
        let form:NgForm;
        form = value['data'];
        let tree_number = form.value.value;
        if(this.scanInput == null || this.scanInput == ""){
          this.treeService.getIdByName(tree_number,(res:PokokResponse)=>{
            this.scanInput = res.id.toString();
            this._proceedToWork();
          });
        }else{
          if(this.scanInput!=null && this.scanInput != ""){
            this._proceedToWork();
          }
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
    this.disablePostponedTaskBtn = false;
  }

  _populateData(res:[TaskResponseModel]){
    this.activeTaskList = [];
    this.finishedTaskList = [];
    this.newTaskList = [];
    this.posponedTaskList = [];
    if(this.task == "Balut"){
      if(this.role == UserRole.penyelia_balut){
        this._populateDataForBalutSvTask(res);
      }else if(this.role == UserRole.petugas_balut){
        this._populateDataForBalutWorkerTask(res);
      }
    }else if(this.task == "Pendebungaan Terkawal (CP)"){
      if(this.role == UserRole.penyelia_balut){
        this._populateDataForCPSvTask(res);
      }else if(this.role == UserRole.petugas_balut){
        this._populateDataForCPWorkerTask(res);
      }
    }else{
      if(res.length > 0){
        res.forEach(element => {
          let countThis:boolean = false;
          if(element.jenis.toLowerCase() == "balut" && this.task == "Balut"){
            countThis = true;
          }else if(element.jenis == "debung" && this.task == "Pendebungaan Terkawal (CP)"){
            countThis = true;
          }else if(element.jenis == "kawal" && this.task == "Kawalan Kualiti (QC)"){
            countThis = true;
          }else if(element.jenis == "tuai" && this.task == "Tuai"){
            countThis = true;
          }else if((element.jenis == "balut" && this.role ==UserRole.petugas_balut) && this.task == "Pendebungaan Terkawal (CP)" && element.status == "sah"){
            this.numOfNewTask++;
            this.newTaskList.push(element);
          }
          if(countThis){
            if(element.status == "siap"){
              this.numOfActiveTask++;
              this.activeTaskList.push(element);
            }else if(element.status == "sah"){
              this.numOfFinishTask++;
              this.finishedTaskList.push(element);
            }else if(element.status == "dicipta" && element.jenis == "debung" && this.task == "Pendebungaan Terkawal (CP)"){
              this.numOfNewTask++;
              this.newTaskList.push(element);
            }else if(element.status == "dicipta" && element.jenis != "debung"){
              this.numOfNewTask++;
              this.newTaskList.push(element);
            }
            this.hasNewTask = true;
          }
        });
      }else{
      }
    }
  }

  _populateDataForBalutSvTask(res:[TaskResponseModel]){
    if(res.length > 0){
      res.forEach(el => {
        if(el.jenis.toLowerCase() == "balut"){
          if(el.status == "siap"){
            this.numOfNewTask++;
            this.newTaskList.push(el);
          } else if(el.status == "sah"){
            this.numOfFinishTask++;
            this.finishedTaskList.push(el);
          }
        }
      });
    }
  }

  _populateDataForCPSvTask(res:[TaskResponseModel]){
    if(res.length > 0){
      res.forEach(el => {
        if(el.jenis.toLowerCase() == "debung"){
          if(el.status == "siap"){
            this.numOfNewTask++;
            this.newTaskList.push(el);
          } else if(el.status == "sah"){
            this.numOfFinishTask++;
            this.finishedTaskList.push(el);
          }
        }
      });
    }
  }

  _populateDataForBalutWorkerTask(res:[TaskResponseModel]){
    if(res.length > 0){
      res.forEach(el => {
        if(el.jenis.toLowerCase() == "balut"){
          if(el.status == "siap"){
            this.numOfActiveTask++;
            this.activeTaskList.push(el);
          } else if(el.status == "sah"){
            this.numOfFinishTask++;
            this.finishedTaskList.push(el);
          }
        }
      });
    }
  }

  _populateDataForCPWorkerTask(res:[TaskResponseModel]){
    if(res.length > 0){
      res.forEach(el => {
        if(el.jenis.toLowerCase() == "debung"){
          if(el.status == "siap"){
            this.numOfActiveTask++;
            this.activeTaskList.push(el);
          } else if(el.status == "sah"){
            this.numOfFinishTask++;
            this.finishedTaskList.push(el);
          }
        }else if(el.jenis.toLowerCase() == "balut"){
          if(el.status == "sah"){
            this.numOfNewTask++;
            this.newTaskList.push(el);
          }
        }
      });
    }
  }

  async _getBaggingTask(){
    if(
      this.role == UserRole.general_worker || 
      this.role == UserRole.petugas_balut || 
      this.role == UserRole.petugas_qc
    ){
      if(!this.isOfflineMode){
        this.baggingService.getByUserId(this.employeeId,(res:[BaggingModel])=>{
          res.forEach(el => {
            if(el.status == TaskStatus.done){
              this.numOfActiveTask++;
              this.activeTaskList.push(el);
            }else{
              this.numOfFinishTask++;
              this.finishedTaskList.push(el);
            }
          });
        });
      }else{
        this.activeTaskList = await this.offlineBaggingService.getSavedBaggingTasks();
        this.numOfActiveTask = this.activeTaskList.length;
      }
    }else{
      this.baggingService.getAll((res:[BaggingModel])=>{
        res.forEach(el => {
          if(el.pengesah_id == this.accountService.getSessionDetails().id.toString()){
            if(el.status == TaskStatus.done){
              this.numOfNewTask++;
              this.newTaskList.push(el);
            }else{
              this.numOfFinishTask++;
              this.finishedTaskList.push(el);
            }
          }
        });
      });
    }
  }

  async _getCPTask(){
    if(
      this.role == UserRole.general_worker || 
      this.role == UserRole.petugas_balut || 
      this.role == UserRole.petugas_qc
    ){
      if(!this.isOfflineMode){
        this.controlPollinationService.getByUserId(this.employeeId,(res:[ControlPollinationModel])=>{
          res.forEach(el => {
            if(el.status == TaskStatus.done){
              this.numOfActiveTask++;
              this.activeTaskList.push(el);
            }else if(el.status == TaskStatus.postpone || el.status == TaskStatus.created){
              this.numOfPosponedTask++;
              this.posponedTaskList.push(el);
            }else{
              this.numOfFinishTask++;
              this.finishedTaskList.push(el);
            }
          });
          this.controlPollinationService.getNewlyCreatedTask(this.employeeId,(res1:[ControlPollinationModel])=>{
            this.numOfNewTask = res1.length;
            this.newTaskList = res1;
          },false);
        });
      }else{
        this.newTaskList = await this.offlineCPService.getNewCpTaskList();
        this.posponedTaskList = await this.offlineCPService.getPostponedTask();
        this.numOfNewTask = this.newTaskList.length;
        this.numOfPosponedTask = this.posponedTaskList.length;
      }
    }else{
      this.controlPollinationService.getAll((res:[ControlPollinationModel])=>{
        res.forEach(el => {
          if(el.pengesah_id == this.accountService.getSessionDetails().id.toString()){
            if(el.status == TaskStatus.done){
              this.numOfNewTask++;
              this.newTaskList.push(el);
            }else if(el.catatan_pengesah != null){
              this.numOfFinishTask++;
              this.finishedTaskList.push(el);
            }
          }
        });
      })
    }
  }

  async _getQCTask(){
    if(
      this.role == UserRole.general_worker || 
      this.role == UserRole.petugas_balut || 
      this.role == UserRole.petugas_qc
    ){
      if(!this.isOfflineMode){
        this.qcService.getByUserId(this.accountService.getSessionDetails().id,(res:[QualityControlModel])=>{
          res.forEach(el => {
            if(el.status == TaskStatus.created){
              this.numOfNewTask++;
              this.newTaskList.push(el);
            }else if(el.status == TaskStatus.done){
              this.numOfActiveTask++;
              this.activeTaskList.push(el);
            }else{
              this.numOfFinishTask++;
              this.finishedTaskList.push(el);
            }
          });
        });
      }else{
        this.newTaskList = await this.offlineQCService.getNewQCTaskList();
        this.numOfNewTask = this.newTaskList.length;
      }
    }else{
      this.qcService.getAll((res:[QualityControlModel])=>{
        res.forEach(el => {
          if(el.pengesah_id == this.accountService.getSessionDetails().id){
            if(el.status == TaskStatus.done){
              this.numOfNewTask++;
              this.newTaskList.push(el);
            }else if(el.status == TaskStatus.created){

            }else{
              this.numOfFinishTask++;
              this.finishedTaskList.push(el);
            }
          }
        });
        this.controlPollinationService.getAll((resBag:[ControlPollinationModel])=>{
          resBag.forEach(el => {
            if(el.status == TaskStatus.verified && !this._hasQcTaskCreated(res,el)){
              this.numOfActiveTask++;
            }
          });
        });
      });
    }
  }

  _hasQcTaskCreated(qcTasksList:[QualityControlModel],cpTask:ControlPollinationModel){
    let retVal = false;
    qcTasksList.forEach(el => {
      if(el.tandan_id == cpTask.tandan_id){
        retVal = true;
      }
    });
    return retVal;
  }

  _getPollenPrepTask(){
    if(
      this.role == UserRole.penyelia_makmal
    ){
      this.pollenPrepService.getAll((res:[PollenPreparationModel])=>{
        res.forEach(el => {
          if(el.pengesah_id == this.accountService.getSessionDetails().id){
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
  }

  async _getHarvestTask(){
    if(
      this.role == UserRole.petugas_tuai
    ){
      if(!this.isOfflineMode){
        this.harvestService.getByUserId(
          this.accountService.getSessionDetails().id,
          this.accountService.getSessionDetails().blok.toString(),
          (res:[HarvestModel])=>{
          res.forEach(el => {
            if(el.status == TaskStatus.created){
              this.numOfNewTask++;
              this.newTaskList.push(el);
            }else if(el.status == TaskStatus.done){
              this.numOfActiveTask++;
              this.activeTaskList.push(el);
            }else{
              this.numOfFinishTask++;
              this.finishedTaskList.push(el);
            }
          });
        });
      }else{
        this.newTaskList = await this.offlineHarvestService.getNewHarvestTaskList();
        this.numOfNewTask = this.newTaskList.length;
      }
    }else{
      this.harvestService.getAll((res:[HarvestModel])=>{
        res.forEach(el => {
          if(el.pengesah_id == this.accountService.getSessionDetails().id ||
             (el.pengesah_id == null && el.pokok?.blok == this.accountService.getSessionDetails().blok) ){
            if(el.status == TaskStatus.done){
              this.numOfNewTask++;
              this.newTaskList.push(el);
            }else if(el.status == TaskStatus.created){

            }else{
              this.numOfFinishTask++;
              this.finishedTaskList.push(el);
            }
          }
        });

        this.qcService.getAll((resBag:[QualityControlModel])=>{
          resBag.forEach(el => {
            if(el.status == TaskStatus.verified && !this._hasHarvestTaskCreated(res,el)){
              this.numOfActiveTask++;
            }
          });
        });
      });
    }
  }

  _hasHarvestTaskCreated(harvestTasksList:[HarvestModel],qcTask:QualityControlModel){
    let retVal = false;
    harvestTasksList.forEach(el => {
      if(el.tandan_id == qcTask.tandan_id){
        retVal = true;
      }
    });
    return retVal;
  }

  _getTask(){
    this.activeTaskList = [];
    this.finishedTaskList = [];
    this.newTaskList = [];
    this.posponedTaskList = [];
    if(this.task == 'Balut'){
      this._getBaggingTask();
    }else if(this.task == 'Pendebungaan Terkawal (CP)'){
      this._getCPTask();
    }else if(this.task == 'Kawalan Kualiti (QC)'){
      this._getQCTask();
    }else if(this.task == 'Tuai'){
      this._getHarvestTask();
    }else if(this.task == 'Penyediaan Pollen'){
      this._getPollenPrepTask();
    }
  }

  async showLoading():Promise<HTMLIonLoadingElement> {
    const loading = await this.loadingCtrl.create();
    loading.present();
    return loading;
  }

  newQCTask(){
    this.router.navigate(
      [
        '/app/tabs/tab1/qc-search-form',
        {
        }
      ]
    );
  }

  newHarvestTask(){
    this.router.navigate(
      [
        '/app/tabs/tab1/harvest-search-form'
      ]
    );
  }

}
