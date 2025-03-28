import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { InAppTaskCycle } from 'src/app/common/inapp-task-cycle';
import { TandanCycle } from 'src/app/common/tandan-cycle';
import { UserSelection } from 'src/app/component/scanner-prompt/scanner-prompt.component';
import { BaggingModel } from 'src/app/model/bagging';
import { ControlPollinationModel } from 'src/app/model/control-pollination';
import { HarvestModel } from 'src/app/model/harvest';
import { LoginResponseModel } from 'src/app/model/login-response';
import { OfflineControlPollinationModel } from 'src/app/model/offline-control-pollination';
import { PokokResponse } from 'src/app/model/pokok-respons';
import { PollenPreparationModel } from 'src/app/model/pollen-preparation-model';
import { QualityControlModel } from 'src/app/model/quality-control';
import { TandanResponse } from 'src/app/model/tandan-response';
import { TaskResponseModel } from 'src/app/model/task-response';
import { ModalService } from 'src/app/service/modal.service';
import { OfflineModeService } from 'src/app/service/offline-mode.service';
import { OfflineBaggingService } from 'src/app/service/offline/offline-bagging.service';
import { OfflineControlPollinationService } from 'src/app/service/offline/offline-control-pollination.service';
import { OfflineHarvestService } from 'src/app/service/offline/offline-harvest.service';
import { OfflineQcService } from 'src/app/service/offline/offline-qc.service';
import { OfflineTandanService } from 'src/app/service/offline/offline-tandan.service';
import { StorageService } from 'src/app/service/storage.service';
import { TaskService } from 'src/app/service/task.service';
import { BaggingService } from 'src/app/service/tasks/bagging.service';
import { ControlPollinationService } from 'src/app/service/tasks/control-pollination.service';
import { HarvestService } from 'src/app/service/tasks/harvest.service';
import { PollenPreparationService } from 'src/app/service/tasks/pollen-preparation.service';
import { QualityControlService } from 'src/app/service/tasks/quality-control.service';
import { TandanService } from 'src/app/service/tasks/tandan.service';
import { TreeService } from 'src/app/service/tasks/tree.service';

@Component({
  selector: 'app-register-status',
  templateUrl: './register-status.page.html',
  styleUrls: ['./register-status.page.scss'],
})
export class RegisterStatusPage implements OnInit {

  regNumber:String;
  cycle:String;
  status:String;
  age:String;
  taskId:String;
  treeNumber:String;
  scanInput:String;
  taskType:String;
  tandanId:String;
  loadingModal:any;
  treeNumberDisplay:String;
  svComment:String;
  isOfflineMode = false;
  baggingWorker:String;
  cpWorker:String;
  qcWorker:String;
  baggingDate:String;
  cpDate:String;
  qcDate:String;
  pollenNumber:String;
  offlineCpTask:OfflineControlPollinationModel;

  constructor(
    private activatedRoute:ActivatedRoute,
    private taskService:TaskService,
    private modalService:ModalService,
    private loadingCtrl: LoadingController,
    private router: Router,
    private tandanService: TandanService,
    private controlPollinationService: ControlPollinationService,
    private baggingService: BaggingService,
    private qualityControlService: QualityControlService,
    private harvestService: HarvestService,
    private treeService: TreeService,
    private pollenPrepService: PollenPreparationService,
    private datePipe: DatePipe,
    private offlineModeService: OfflineModeService,
    private offlineCPService: OfflineControlPollinationService,
    private offlineBaggingService: OfflineBaggingService,
    private offlineTandanService: OfflineTandanService,
    private offlineQCService: OfflineQcService,
    private offlineHarvestService: OfflineHarvestService,
    private storageService: StorageService,
  ) { }

  ngOnInit() {
    this.regNumber = "-";
    this.cycle = "-";
    this.status="-";
    this.age="-";

    this.activatedRoute.params.subscribe(params => {
      if(params['taskId']!=null){
        this.taskId = params['taskId'];
      }
      if(params['treeNum']!=null){
        this.treeNumber = params['treeNum'];
      } 
      if(params['scanInput']!=null){
        this.scanInput = params['scanInput'];
      }
      if(params['taskType']!=null){
        this.taskType = params['taskType'];
      }
      if(params['task']!=null){
        this.taskType = params['task'];
      }
      this.tandanId = params['tandanId'];

      // if(this.scanInput != null){
      //   this.tandanId = this.scanInput;
      //   this._proceedToWork();
      // }
    });
  }

  async ionViewDidEnter() {
    this.isOfflineMode = await this.offlineModeService.isOfflineMode();
    if(this.taskId != null){
      this._getTask();
    }
  }

  async _getQcTask(){
    if(!this.isOfflineMode){
      this.qualityControlService.getById(this.taskId,(res:QualityControlModel)=>{
        this.tandanId = res.tandan_id.toString();
        this._getTandanInfo(res.tandan_id.toString());
        this.svComment = res.catatan_pengesah;
        this._getBaggingInfo(res.tandan_id);
      });
    }else{
      let qcTask:QualityControlModel = await this.offlineQCService.getNewTaskById(parseInt(this.taskId.toString()));
      this.tandanId = qcTask.tandan_id.toString();
      let tandan:TandanResponse = await this.offlineTandanService.getById(qcTask.tandan_id);
      this.treeNumberDisplay = qcTask.pokok?.progeny+'-'+qcTask.pokok?.no_pokok;
      this.regNumber = tandan.no_daftar;
      this.cycle = this._getCycleName(tandan)?.toUpperCase();
      this.status=tandan.status_tandan?.toUpperCase();
      this.age=tandan.umur? tandan.umur.toString(): this._calculateAge(tandan.tarikh_daftar).toString();
      this.svComment = qcTask.catatan_pengesah;
    }
  }

  _getQcInfo(tandanId){
    this.qualityControlService.getByTandanId(tandanId,(res:QualityControlModel[])=>{
      this.qcDate = this.datePipe.transform(Date.parse(res[0].created_at?.toString()),"dd-MM-YYYY HH:mm:ss");
      this.taskService.getUserById(res[0].id_sv_qc).subscribe(
        (res2:LoginResponseModel) => {
          this.qcWorker = res2.nama;
          this._getBaggingInfo(tandanId);
        }
      );
    },false);
  }

  _getBaggingInfo(tandanId){
    this.baggingService.getByTandanId(tandanId,(res:BaggingModel[])=>{
      this.baggingDate = this.datePipe.transform(Date.parse(res[0].created_at?.toString()),"dd-MM-YYYY HH:mm:ss");
      this.taskService.getUserById(res[0].id_sv_balut).subscribe(
        (res2:LoginResponseModel) => {
          this.baggingWorker = res2.nama;
          this._getCPInfo(tandanId);
        }
      );
    },false);
  }

  _getCPInfo(tandanId){
    this.controlPollinationService.getByTandanId(tandanId,(res:ControlPollinationModel[])=>{
      this.cpDate = this.datePipe.transform(Date.parse(res[0].created_at?.toString()),"dd-MM-YYYY HH:mm:ss");
      this.taskService.getUserById(res[0].id_sv_cp).subscribe(
        (res2:LoginResponseModel) => {
          this.cpWorker = res2.nama;
          this.treeService.getById(res[0].pokok_id.toString(),(res2:PokokResponse)=>{
            this.pollenNumber = res2.progeny+'-'+res2.no_pokok;
          });
        }
      );
    },false);
  }

  _getPollenPrepTask(){
    this.pollenPrepService.getById(this.taskId,(res:PollenPreparationModel)=>{
      this.tandanId = res.tandan_id.toString();
      this._getTandanInfo(res.tandan_id.toString());
    });
  }

  async _getHarvestTask(){
    if(!this.isOfflineMode){
      this.harvestService.getById(this.taskId,(res:HarvestModel)=>{
        this.tandanId = res.tandan_id.toString();
        this._getTandanInfo(res.tandan_id.toString());
        this.svComment = res.catatan_pengesah;
        this._getQcInfo(res.tandan_id);
      });
    }else{
      let harvestTask:HarvestModel = await this.offlineHarvestService.getNewTaskById(parseInt(this.taskId.toString()));
      this.tandanId = harvestTask.tandan_id.toString();
      let tandanRes:TandanResponse = await this.offlineTandanService.getById(harvestTask.tandan_id);
      this.treeNumberDisplay = harvestTask.pokok?.progeny+'-'+harvestTask.pokok?.no_pokok;
      this.regNumber = tandanRes.no_daftar;
      this.cycle = this._getCycleName(tandanRes)?.toUpperCase();
      this.status=tandanRes.status_tandan?.toUpperCase();
      this.age=tandanRes.umur? tandanRes.umur.toString(): this._calculateAge(tandanRes.tarikh_daftar).toString();
      this.svComment = harvestTask.catatan_pengesah;
    }
  }

  async _getCPTask(){
    if(!this.isOfflineMode){
      this.baggingService.getById(this.taskId,(res:BaggingModel)=>{
        this.treeNumberDisplay = res.pokok?.progeny+'-'+res.pokok?.no_pokok;
        this.tandanId = res.tandan_id.toString();
        this.tandanService.getById(res.tandan_id.toString(),(tandanRes:TandanResponse)=>{
          this.regNumber = tandanRes.no_daftar;
          this.cycle = this._getCycleName(tandanRes)?.toUpperCase();
          this.status=tandanRes.status_tandan?.toUpperCase();
          this.age=tandanRes.umur? tandanRes.umur.toString(): this._calculateAge(tandanRes.tarikh_daftar).toString();
        });
      },false);
    }else{
      let baggingTask:BaggingModel = await this.offlineCPService.getNewTaskById(parseInt(this.taskId.toString()));
      let tandan:TandanResponse = await this.offlineTandanService.getById(baggingTask.tandan_id);
      this.tandanId = baggingTask.tandan_id.toString();
      this.treeNumberDisplay = baggingTask.pokok?.progeny+'-'+baggingTask.pokok?.no_pokok;
      this.regNumber = tandan.no_daftar;
      this.cycle = this._getCycleName(tandan)?.toUpperCase();
      this.status=tandan.status_tandan?.toUpperCase();
      this.age=tandan.umur? tandan.umur.toString(): this._calculateAge(tandan.tarikh_daftar).toString();
    }
  }

  async _getBaggingTask(){
    if(!this.isOfflineMode){
      this.baggingService.getById(this.taskId,(res:BaggingModel)=>{
        this.tandanId = res.tandan_id.toString();
        this.treeNumberDisplay = res.pokok?.progeny+'-'+res.pokok?.no_pokok;
        this.tandanService.getById(res.tandan_id.toString(),(tandanRes:TandanResponse)=>{
          this.regNumber = tandanRes.no_daftar;
          this.cycle = this._getCycleName(tandanRes)?.toUpperCase();
          this.status=tandanRes.status_tandan?.toUpperCase();
          this.age=tandanRes.umur? tandanRes.umur.toString(): this._calculateAge(tandanRes.tarikh_daftar).toString();
        });
      },false);
    }else{
      let baggingTask:BaggingModel = await this.offlineBaggingService.getPosponedBaggingTaskById(parseInt(this.taskId.toString()));
      this.tandanId = baggingTask.tandan_id.toString();
      let tandan:TandanResponse = await this.offlineTandanService.getById(baggingTask.tandan_id);
      this.treeNumberDisplay = baggingTask.pokok?.progeny+'-'+baggingTask.pokok?.no_pokok;
      this.regNumber = tandan.no_daftar;
      this.cycle = this._getCycleName(tandan)?.toUpperCase();
      this.status=tandan.status_tandan?.toUpperCase();
      this.age=tandan.umur? tandan.umur.toString(): this._calculateAge(tandan.tarikh_daftar).toString();
    }
  }

  async _getPostponedCPTask(){
    if(!this.isOfflineMode){
      this.controlPollinationService.getById(this.taskId,(res:ControlPollinationModel)=>{
        this.treeNumberDisplay = res.pokok?.progeny+'-'+res.pokok?.no_pokok;
        this.tandanId = res.tandan_id.toString();
        this.tandanService.getById(res.tandan_id.toString(),(tandanRes:TandanResponse)=>{
          this.regNumber = tandanRes.no_daftar;
          this.cycle = this._getCycleName(tandanRes)?.toUpperCase();
          this.status=tandanRes.status_tandan?.toUpperCase();
          this.age=tandanRes.umur? tandanRes.umur.toString(): this._calculateAge(tandanRes.tarikh_daftar).toString();
        });
      },false);
    }else{
      let task = await this.offlineCPService.getPostponedTaskById(this.taskId.toString());
      this.tandanId = task.tandan_id.toString();
      let tandan:TandanResponse = await this.offlineTandanService.getById(parseInt(this.tandanId.toString()));
      this.regNumber = tandan.no_daftar;
      this.cycle = this._getCycleName(tandan)?.toUpperCase();
      this.status=tandan.status_tandan?.toUpperCase();
      this.age=tandan.umur? tandan.umur.toString(): this._calculateAge(tandan.tarikh_daftar).toString();
      this.treeNumberDisplay = task?.pokok?.progeny+'-'+task?.pokok?.no_pokok;
    }
  }

  async _getInteruptedCPTask(){
    if(!this.isOfflineMode){
      this.controlPollinationService.getById(this.taskId,(res:ControlPollinationModel)=>{
        this.tandanId = res.tandan_id.toString();
        this.tandanService.getById(res.tandan_id.toString(),(tandanRes:TandanResponse)=>{
          this.treeNumberDisplay = res.pokok?.progeny+'-'+res.pokok?.no_pokok;
          this.regNumber = tandanRes.no_daftar;
          this.cycle = this._getCycleName(tandanRes)?.toUpperCase();
          this.status=tandanRes.status_tandan?.toUpperCase();
          this.age=tandanRes.umur? tandanRes.umur.toString(): this._calculateAge(tandanRes.tarikh_daftar).toString();
        });
      },false);
    }else{
      let task = await this.offlineCPService.getPostponedTaskByTandanId(this.tandanId.toString());
      if(task != null){
        this.treeNumberDisplay = task.pokok?.progeny+'-'+task.pokok?.no_pokok;
      }else{
        this.offlineCpTask = await this.offlineCPService.getPostponedTaskById(this.taskId.toString());
        this.treeNumberDisplay = this.offlineCpTask?.pokok?.progeny+'-'+this.offlineCpTask?.pokok?.no_pokok;
      }
      let tandan:TandanResponse = await this.offlineTandanService.getById(parseInt(this.tandanId.toString()));
      this.regNumber = tandan.no_daftar;
      this.cycle = this._getCycleName(tandan)?.toUpperCase();
      this.status=tandan.status_tandan?.toUpperCase();
      this.age=tandan.umur? tandan.umur.toString(): this._calculateAge(tandan.tarikh_daftar).toString();
    }
  }

  async _getRejectedCPTask(){
    if(!this.isOfflineMode){
      this.controlPollinationService.getById(this.taskId,(res:ControlPollinationModel)=>{
        this.tandanId = res.tandan_id.toString();
        this.tandanService.getById(res.tandan_id.toString(),(tandanRes:TandanResponse)=>{
          this.treeNumberDisplay = res.pokok?.progeny+'-'+res.pokok?.no_pokok;
          this.regNumber = tandanRes.no_daftar;
          this.cycle = this._getCycleName(tandanRes)?.toUpperCase();;
          this.status=tandanRes.status_tandan?.toUpperCase();
          this.age=tandanRes.umur? tandanRes.umur.toString(): this._calculateAge(tandanRes.tarikh_daftar).toString();
          this.svComment = res.catatan_pengesah;
        });
      },false);
    }else{
      let task = await this.offlineCPService.getRejectedTaskById(this.taskId.toString());
      this.tandanId = task.tandan_id.toString();
      let tandan:TandanResponse = await this.offlineTandanService.getById(parseInt(task.tandan_id.toString()));
      this.regNumber = tandan.no_daftar;
      this.cycle = this._getCycleName(tandan)?.toUpperCase();;
      this.status=tandan.status_tandan?.toUpperCase();
      this.age=tandan.umur? tandan.umur.toString(): this._calculateAge(tandan.tarikh_daftar).toString();
      this.treeNumberDisplay = task?.pokok?.progeny+'-'+task?.pokok?.no_pokok;
      this.svComment = task?.catatan_pengesah;
    }
  }

  _calculateAge(prvDate:string){
    let currentDate = Date.parse(this.datePipe.transform(Date.now(),"yyyy-MM-dd"));
    let prevDate = Date.parse(prvDate);
    let retVal = (currentDate - prevDate)/1000/60/60/24;
    return retVal;
  }

  async _getTask(){
    if(this.taskType == "Pendebungaan Terkawal (CP)"){
      this._getCPTask();
    }else if(this.taskType == "Pendebungaan Terkawal (CP)posponed"){
      this._getPostponedCPTask();
    }else if(this.taskType == "Pendebungaan Terkawal (CP)interrupted"){
      this._getInteruptedCPTask();
    }else if(this.taskType == "Pendebungaan Terkawal (CP)rejected"){
      this._getRejectedCPTask();
    }else if(this.taskType == "Kawalan Kualiti (QC)"){
      this._getQcTask();
    }else if(this.taskType == "Kawalan Kualiti (QC)posponed"){
      this._getQcTask();
    }else if(this.taskType == "Tuai" || this.taskType == "Tuaiposponed" || this.taskType == "Tuaianjak"){
      this._getHarvestTask();
    }else if(this.taskType == "Penyediaan Pollen" || this.taskType == InAppTaskCycle.posponedpp || this.taskType == InAppTaskCycle.pp){
      this._getPollenPrepTask();
    }else if(this.taskType == "Balutposponed"){
      this._getBaggingTask();
    }else{
      this.loadingModal= await this.showLoading();
      this.taskService.getTask(this.taskId).subscribe(
        (res:TaskResponseModel) => {
          this.loadingModal.dismiss();
          this.tandanId = res.tandan_id.toString();
          this._getTandanInfo(res.tandan_id.toString());
        },
        (err:HttpErrorResponse) => {
          this.loadingModal.dismiss();
        }
      );
    }
    setTimeout(()=>{
      if(this.scanInput != null && (this.tandanId == this.scanInput)){
        // this.tandanId = this.scanInput;
        this._proceedToWork();
      }else if(this.scanInput != null){
        this.scanInput = null;
        this.modalService.textAndBtnPrompt('Tandan salah',"OK");
      }
    },3000);
    
  }

  _getPokokInfo(){
    this.treeService.getById(this.treeNumber,(res:PokokResponse)=>{
      this.treeNumberDisplay = res.progeny+'-'+res.no_pokok;
    });
  }

  async _getTandanInfo(tandan_id:String){
    this.loadingModal= await this.showLoading();
    this.taskService.getTandanById(tandan_id).subscribe(
      (res:TandanResponse) => {
        this.loadingModal.dismiss();
        this.regNumber = res.no_daftar;
        this.treeNumber = res.pokok_id.toString();
        this.cycle = this._getCycleName(res)?.toUpperCase();
        this.status=res.status_tandan?.toUpperCase();
        this.age=res.umur? res.umur.toString(): this._calculateAge(res.tarikh_daftar).toString();
        this._getPokokInfo();
      },
      (err:HttpErrorResponse) => {
        this.loadingModal.dismiss();
      }
    );
  }

  _getCycleName(res:TandanResponse):String{
    let retVal:String;
    if(res.kitaran == TandanCycle.bagging){
      retVal = "Balut"
    }else if(res.kitaran == TandanCycle.cp){
      retVal = "Pendebungaan Terkawal"
    }else if(res.kitaran == TandanCycle.qc){
      retVal = "Kawalan Kualiti"
    }else if(res.kitaran == TandanCycle.harvest){
      retVal = "Tuai"
    }else if(res.kitaran == TandanCycle.pp){
      retVal = "Penyediaan Pollen"
    }

    return retVal;
  }

  async showLoading():Promise<HTMLIonLoadingElement> {
    const loading = await this.loadingCtrl.create();
    loading.present();
    return loading;
  }

  promptScan(){
    this.modalService.qrPrompt("No Daftar").then(
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
                taskId:this.taskId,
                returnUrl:"/app/tabs/tab1/reg-status",
                treeNum:this.treeNumber,
                task:this.taskType,
              }
            ],
            {
              replaceUrl : true
            }
          );
        }
    });
  }

  _manualInput(){
    this.modalService.singleInput("No Daftar").then(
      (value)=>{
        let form:NgForm;
        form = value['data'];
        // todo: check for regNumber before proceed to next step
        if( this.regNumber == form.value.value){
          this._proceedToWork();
        }else{
          this.modalService.textAndBtnPrompt('Tandan salah',"OK");
        }
      }
    );
  }

  async _proceedToWork(){
    if(this.taskType == "Pendebungaan Terkawal (CP)"){
      this.router.navigate(
        [
          'app/tabs/tab1/defect',
          {
            taskId:this.taskId,
            treeNum:this.treeNumber,
            taskType:"debung",
          }
        ]
      );
    }else if(this.taskType == "Pendebungaan Terkawal (CP)posponed"){
      this.router.navigate(
        [
          'app/tabs/tab1/defect',
          {
            taskId:this.taskId,
            treeNum:this.treeNumber,
            taskType:"debungposponed",
          }
        ]
      );
    }else if(this.taskType == "Pendebungaan Terkawal (CP)rejected"){
      this.router.navigate(
        [
          'app/tabs/tab1/defect',
          {
            taskId:this.taskId,
            treeNum:this.treeNumber,
            taskType:InAppTaskCycle.rejectedCp,
          }
        ]
      );
    }else if(this.taskType == "Pendebungaan Terkawal (CP)interrupted"){

      let navItem = {};
      if(this.taskId != null && this.taskId != 'undefined'){
        navItem = {
          taskId:this.taskId
        }
      }else{
        navItem = {
          tandanId:this.tandanId,
        }
      }

      this.router.navigate(
        [
          '/app/tabs/tab1/control-pollen-form',
          navItem
        ]
      );
    }else if(this.taskType == "Kawalan Kualiti (QC)"){
      this.router.navigate(
        [
          'app/tabs/tab1/defect',
          {
            taskId:this.taskId,
            treeNum:this.treeNumber,
            taskType:"qc",
          }
        ]
      );
    }else if(this.taskType == "Kawalan Kualiti (QC)posponed"){
      this.router.navigate(
        [
          'app/tabs/tab1/defect',
          {
            taskId:this.taskId,
            treeNum:this.treeNumber,
            taskType:InAppTaskCycle.posponedqc,
          }
        ]
      );
    }else if(this.taskType == "Tuai"){
      this.router.navigate(
        [
          'app/tabs/tab1/defect',
          {
            taskId:this.taskId,
            treeNum:this.treeNumber,
            taskType:"tuai",
          }
        ]
      );
    }else if(this.taskType == "Tuaiposponed"){
      this.router.navigate(
        [
          'app/tabs/tab1/defect',
          {
            taskId:this.taskId,
            treeNum:this.treeNumber,
            taskType:InAppTaskCycle.posponedharvest,
          }
        ]
      );
    }else if(this.taskType == "Tuaianjak"){
      this.router.navigate(
        [
          'app/tabs/tab1/defect',
          {
            taskId:this.taskId,
            treeNum:this.treeNumber,
            taskType:InAppTaskCycle.anjakharvest,
          }
        ]
      );
    }else if(this.taskType == "Balutposponed"){
      this.router.navigate(
        [
          'app/tabs/tab1/task-status',
          {
            taskId:this.taskId,
            treeNum:this.treeNumber,
            taskType:InAppTaskCycle.posponedbagging,
          }
        ]
      );
    }else if(this.taskType == InAppTaskCycle.posponedpp){
      this.router.navigate(
        [
          'app/tabs/tab1/pollen-prep-form',
          {
            taskId:this.taskId,
            tandanId:this.tandanId
          }
        ]
      );
    }else if(this.taskType == InAppTaskCycle.pp){
      this.router.navigate(
        [
          'app/tabs/tab1/defect',
          {
            taskType:InAppTaskCycle.pp,
            taskId:this.taskId,
            tandanId:this.tandanId,
            var1:null
          }
        ]
      );
    }else{
      this.router.navigate(
        [
          'app/tabs/tab1/task-status',
          {
            tandanId:this.tandanId,
            treeNumber:this.treeNumber,
            taskType:"debung",
          }
        ]
      );
    }
  }

}
