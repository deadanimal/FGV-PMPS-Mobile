import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { InAppTaskCycle } from 'src/app/common/inapp-task-cycle';
import { PollenStatus } from 'src/app/common/pollen-status';
import { TaskStatus } from 'src/app/common/task-status';
import { UserSelection } from 'src/app/component/scanner-prompt/scanner-prompt.component';
import { BaggingModel } from 'src/app/model/bagging';
import { ControlPollinationModel } from 'src/app/model/control-pollination';
import { HarvestModel } from 'src/app/model/harvest';
import { LoginResponseModel } from 'src/app/model/login-response';
import { PokokResponse } from 'src/app/model/pokok-respons';
import { QcSearchResponse } from 'src/app/model/qc-search-response';
import { PollenPreparationModel } from 'src/app/model/pollen-preparation-model';
import { QualityControlModel } from 'src/app/model/quality-control';
import { AccountService, UserRole } from 'src/app/service/account.service';
import { ModalService } from 'src/app/service/modal.service';
import { OfflineModeService } from 'src/app/service/offline-mode.service';
import { OfflineBaggingService } from 'src/app/service/offline/offline-bagging.service';
import { OfflineControlPollinationService } from 'src/app/service/offline/offline-control-pollination.service';
import { OfflineHarvestService } from 'src/app/service/offline/offline-harvest.service';
import { OfflineQcService } from 'src/app/service/offline/offline-qc.service';
import { OfflineTreeService } from 'src/app/service/offline/offline-tree.service';
import { BaggingService } from 'src/app/service/tasks/bagging.service';
import { ControlPollinationService } from 'src/app/service/tasks/control-pollination.service';
import { HarvestService } from 'src/app/service/tasks/harvest.service';
import { PollenPreparationService } from 'src/app/service/tasks/pollen-preparation.service';
import { QualityControlService } from 'src/app/service/tasks/quality-control.service';
import { TreeService } from 'src/app/service/tasks/tree.service';
import { TreeType } from 'src/app/common/tree-type';
import { DatePipe } from '@angular/common';
import { PollenUsageService } from 'src/app/service/tasks/pollen-usage.service';

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
  roles = UserRole;

  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private accountService:AccountService,
    private datePipe:DatePipe,
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
    private pollenUseService:PollenUsageService,
    private offlineQCService:OfflineQcService,
    private offlineHarvestService:OfflineHarvestService,
  ) { }

  ngOnInit() {
  }

  async ionViewDidEnter() {
    this.numOfActiveTask = 0;
    this.numOfFinishTask = 0;
    this.numOfNewTask = 0;
    this.numOfPosponedTask = 0;
    this.activatedRoute.params.subscribe(params => {
      if(params['task']!=null){
        this.task = params['task'];
        if(params['task'] == "wrap" || params['task'] == "Balut"){
          this.task = "Balut";
          this.taskBtnName = "Balut";
          this.taskIconPath = "/assets/balut_icon.png";
        }else if(params['task'] == "cp"){
          this.task = "Pendebungaan Terkawal (CP)";
          this.taskBtnName = "CP";
          this.taskIconPath = "/assets/cp_icon.png";
        }else if(params['task'] == "Kawalan Kualiti (QC)"){
          this.taskBtnName = "QC";
          this.taskIconPath = "/assets/qc_icon.png";
        }
        else if(params['task'] == "Tuai"){
          this.taskBtnName = "Tuai";
          this.taskIconPath = "/assets/tuai_icon.png";
        }
      }
      if(params['scanInput']!=null){
        this.scanInput = params['scanInput']; // this is tree id
       }
    });

    let user:LoginResponseModel = await this.accountService._getDataFromStorage();
    this.role =  this.accountService.getUserRole();
    this.employeeId = user.id;
    this.isOfflineMode = await this.offlineModeService.isOfflineMode();
    this._getTask();
    if(this.scanInput != null){
      if(!this.isOfflineMode){
        this.treeService.getById(this.scanInput,(res:PokokResponse)=>{
          this._manualInput(res.progeny+"-"+res.no_pokok);
        },false);
      }else{
        try{
            let treeNumber = await this.offlineTreeService.getById(this.scanInput);
            this._manualInput(treeNumber.progeny+"-"+treeNumber.no_pokok);
          }catch{
            this.modalService.successPrompt('Tiada data, Sila sync dahulu');
          }
      }
    }
  }

  viewTask(taskId:String,status:String,id:number,param1:string = ""){
    if(status == "completed"){
      if(
          taskId == 'balut' ||
          taskId == 'qc' ||
          taskId == 'cp' ||
          taskId == 'qcSv'||
          taskId == 'harvestSv'||
          taskId == 'harvest'||
          taskId == 'pollen_use'
        ){
        this.router.navigate(['app/tabs/tab1/task-finished',{taskId:id,taskType:this.task}]);
      }else{
        this.router.navigate(['app/tabs/tab1/task-finished',{tandanId:id}]);
      }
    }else if( status == 'posponed'){
      if(taskId == 'cp'){
        this.router.navigate(['/app/tabs/tab1/reg-status',
        {
          taskId:id,
          treeNum:param1,
          taskType:this.task+"posponed",
        }]);
      }else if(taskId == 'bagging'){
        this.router.navigate(['/app/tabs/tab1/reg-status',
        {
          taskId:id,
          treeNum:param1,
          taskType:this.task+"posponed",
        }]);
      }else if(taskId == 'qc'){
        this.router.navigate(['/app/tabs/tab1/reg-status',
        {
          taskId:id,
          treeNum:param1,
          taskType:this.task+"posponed",
        }]);
      }else if(taskId == 'harvest'){
        this.router.navigate(['/app/tabs/tab1/reg-status',
        {
          taskId:id,
          treeNum:param1,
          taskType:this.task+"posponed",
        }]);
      }
    }else if( status == 'rejected'){
      if(taskId == 'cp'){
        this.router.navigate(['/app/tabs/tab1/reg-status',
        {
          taskId:id,
          treeNum:param1,
          taskType:this.task+"rejected",
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
    }else if(status == 'anjak' && taskId == 'harvest'){
      this.router.navigate(['/app/tabs/tab1/reg-status',
      {
        taskId:id,
        treeNum:param1,
        taskType:this.task+"anjak",
      }]);
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
        let tree_number = form?.value?.value;
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

  async _getBaggingTask(){
    if(
      this.role == UserRole.general_worker || 
      this.role == UserRole.petugas_balut || 
      this.role == UserRole.petugas_balut_fatherpalm || 
      this.role == UserRole.petugas_qc
    ){
      if(!this.isOfflineMode){
        this.baggingService.getByUserId(this.employeeId,(res:[BaggingModel])=>{
          res.forEach(el => {
            if(el.status == TaskStatus.done){
              this.numOfActiveTask++;
              this.activeTaskList.push(el);
            // }else if(el.status == TaskStatus.rejected){
            //   this.numOfPosponedTask++;
            //   this.posponedTaskList.push(el);
            }else if(el.status != TaskStatus.redo){
              this.numOfFinishTask++;
              this.finishedTaskList.push(el);
            }
          });
        });
      }else{
        this.activeTaskList = await this.offlineBaggingService.getSavedBaggingTasks();
        // this.posponedTaskList = await this.offlineBaggingService.getPosponedBaggingTasks();
        if(this.activeTaskList == null){
          this.activeTaskList = [];
        }
        // if(this.posponedTaskList == null){
        //   this.posponedTaskList = [];
        // }
        // this.numOfActiveTask = this.activeTaskList.length;
        // this.numOfPosponedTask = this.posponedTaskList.length;
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
            if(el.status == TaskStatus.done || el.status == TaskStatus.defect){
              this.numOfActiveTask++;
              this.activeTaskList.push(el);
            }else if(el.status == TaskStatus.postpone || el.status == TaskStatus.created || el.status == TaskStatus.rejected){
              this.numOfPosponedTask++;
              this.posponedTaskList.push(el);
            }else if(el.status != TaskStatus.redo){
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
        let tempList = await this.offlineCPService.getRejectedCpTaskList();
        if(this.newTaskList == null){
          this.newTaskList = []
        }if(this.posponedTaskList == null){
          this.posponedTaskList = []
        }if(tempList == null){
          tempList = []
        }
        this.posponedTaskList.push(...tempList);
        this.numOfNewTask = this.newTaskList.length;
        this.numOfPosponedTask = this.posponedTaskList.length;
      }
    }else{
      this.controlPollinationService.getAll((res:[ControlPollinationModel])=>{
        res.forEach(el => {
          if(el.pengesah_id == this.accountService.getSessionDetails().id.toString()){
            if(el.status == TaskStatus.done || el.status == TaskStatus.defect ){
              this.numOfNewTask++;
              this.newTaskList.push(el);
            }else if(el.status == TaskStatus.verified ||
                      el.status == TaskStatus.rejected){
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
              if(this.isLate(el.created_at)){
                el.late = true;
                this.numOfPosponedTask++;
                this.posponedTaskList.push(el);
              }else{
                el.late = false;
                this.numOfNewTask++;
                this.newTaskList.push(el);
              }
            }else if(el.status == TaskStatus.done || el.status == TaskStatus.defect){
              this.numOfActiveTask++;
              this.activeTaskList.push(el);
            }else if(el.status == TaskStatus.rejected){
              this.numOfPosponedTask++;
              this.posponedTaskList.push(el);
            }else if(el.status != TaskStatus.redo){
              this.numOfFinishTask++;
              this.finishedTaskList.push(el);
            }
          });
        });
      }else{
        let taskList = await this.offlineQCService.getNewQCTaskList();
        if(taskList == null){
          taskList = [];
        }
        taskList.forEach(el => {
          if(el.status == TaskStatus.created){
            if(this.isLate(el.created_at)){
              el.late = true;
              this.numOfPosponedTask++;
              this.posponedTaskList.push(el);
            }else{
              el.late = false;
              this.numOfNewTask++;
              this.newTaskList.push(el);
            }
          }else if(el.status == TaskStatus.rejected){
            this.numOfPosponedTask++;
            this.posponedTaskList.push(el);
          }
        });
      }
    }else{
      this.qcService.getAll((res:[QualityControlModel])=>{
        res.forEach(el => {
          if(el.pengesah_id == this.accountService.getSessionDetails().id){
            if(el.status == TaskStatus.done || el.status == TaskStatus.defect){
              this.numOfNewTask++;
              this.newTaskList.push(el);
            }else if(el.status == TaskStatus.created){

            }else if(el.status != TaskStatus.redo){
              this.numOfFinishTask++;
              this.finishedTaskList.push(el);
            }
          }
        });
        this.baggingService.searchByTreeInfo(
          "",
          "",
          "",
          (res:[QcSearchResponse])=>{
            res.forEach(el => {
              if(el.tandan.kitaran == 'debung' && el.tandan.status_tandan == 'aktif'){
                this.numOfActiveTask++;
              }
            });
          }
        )
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
      this.role == UserRole.penyelia_makmal || this.role == UserRole.penyelia_fatherpalm
    ){
      this.pollenPrepService.getAll((res:[PollenPreparationModel])=>{
        res.forEach(el => {
          if(el.pengesah_id == this.accountService.getSessionDetails().id){
            if(el.status == TaskStatus.done){
              this.numOfNewTask++;
              this.newTaskList.push(el);
            }else if(el.status == TaskStatus.created && ( 
              el.status_pollen == PollenStatus.qc1 || 
              el.status_pollen == PollenStatus.qc2 || 
              el.status_pollen == PollenStatus.qc3 )){
              this.numOfNewTask++;
              this.newTaskList.push(el);
            }else if(el.status == TaskStatus.defect){
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

  _getPollenUseTask(){
    this.pollenPrepService.getAll((res:[PollenPreparationModel])=>{
      res.forEach(el => {
        if(el.status_pollen == 'lupus'){
          this.numOfFinishTask++;
          this.finishedTaskList.push(el);
        }
      });
    });
  }

  async _getHarvestTask(){
    if(
      this.role == UserRole.petugas_tuai ||
      this.role == UserRole.petugas_balut_fatherpalm
    ){
      if(!this.isOfflineMode){
        this.harvestService.getByUserId(
          this.accountService.getSessionDetails().id,
          this.accountService.getSessionDetails().blok.toString(),
          (res:[HarvestModel])=>{
          res.forEach(el => {
            if(el.status == TaskStatus.created){
              if(this.isLate(el.created_at)){
                el.late = true;
                this.numOfPosponedTask++;
                this.posponedTaskList.push(el);
              }else{
                el.late = false;
                this.numOfNewTask++;
                this.newTaskList.push(el);
              }
            }else if(el.status == TaskStatus.done || el.status == TaskStatus.defect){
              this.numOfActiveTask++;
              this.activeTaskList.push(el);
            }else if(el.status == TaskStatus.rejected || el.status == TaskStatus.postpone){
              this.numOfPosponedTask++;
              this.posponedTaskList.push(el);
            }else if(el.status != TaskStatus.redo){
              this.numOfFinishTask++;
              this.finishedTaskList.push(el);
            }
          });
        });
      }else{
        let tasksList = await this.offlineHarvestService.getNewHarvestTaskList();
        tasksList.forEach(el => {
          if(el.status == TaskStatus.created){
            if(this.isLate(el.created_at)){
              el.late = true;
              this.numOfPosponedTask++;
              this.posponedTaskList.push(el);
            }else{
              el.late = false;
              this.numOfNewTask++;
              this.newTaskList.push(el);
            }
          }else if(el.status == TaskStatus.done || el.status == TaskStatus.defect){
            this.numOfActiveTask++;
            this.activeTaskList.push(el);
          }else if(el.status == TaskStatus.rejected || el.status == TaskStatus.postpone){
            this.numOfPosponedTask++;
            this.posponedTaskList.push(el);
          }else{
            this.numOfFinishTask++;
            this.finishedTaskList.push(el);
          }
        });
      }
    }else{
      this.harvestService.getAll((res:[HarvestModel])=>{
        res.forEach(el => {
          if(el.pengesah_id == this.accountService.getSessionDetails().id ||
             (el.pengesah_id == null && this.accountService.getSessionDetails().blok.includes(el.pokok?.blok)) ){
            if(el.status == TaskStatus.done || el.status == TaskStatus.defect){
              this.numOfNewTask++;
              this.newTaskList.push(el);
            }else if(el.status == TaskStatus.created || el.status == TaskStatus.postpone){

            }else if(el.status != TaskStatus.redo){
              this.numOfFinishTask++;
              this.finishedTaskList.push(el);
            }
          }
        });

        this.baggingService.searchByTreeInfo2(
          "","","",
          (res:[QcSearchResponse])=>{
            res.forEach(el => {
              if(( this.role != UserRole.penyelia_fatherpalm && el.pokok.jantina == TreeType.Motherpalm && el.tandan.kitaran == 'kawal' && el.status == TaskStatus.verified) && el.tandan.status_tandan == 'aktif'){
                this.numOfActiveTask++;
              }else if( ( this.role == UserRole.penyelia_fatherpalm &&
                          el.pokok.jantina == TreeType.Fatherpalm && 
                          el.tandan.kitaran == 'balut' ) && 
                          el.tandan.status_tandan == 'aktif'){
                this.numOfActiveTask++;
              }
            });
          }
        );
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
    }else if(this.task == 'Penggunaan Pollen'){
      this._getPollenUseTask();
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

  taskDistributed(){
    this.router.navigate(
      [
        '/app/tabs/tab1/task-distributed'
      ]
    );
  }

  newPUTask(){
    this.router.navigate(
      [
        '/app/tabs/tab1/stok-pollen-form'
      ]
    );
  }
  
  returnPUTask(){
    this.router.navigate(
      [
        '/app/tabs/tab1/stok-pollen-list'
      ]
    );
  }

  isLate(dateString){
    let createdDate = new Date(dateString);
    let today = new Date();
    return createdDate.toDateString() !== today.toDateString();
  }

}
