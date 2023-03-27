import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InAppTaskCycle } from 'src/app/common/inapp-task-cycle';
import { TandanCycle } from 'src/app/common/tandan-cycle';
import { BaggingModel } from 'src/app/model/bagging';
import { ControlPollinationModel } from 'src/app/model/control-pollination';
import { DefectModel } from 'src/app/model/defect';
import { HarvestModel } from 'src/app/model/harvest';
import { LoginResponseModel } from 'src/app/model/login-response';
import { PokokResponse } from 'src/app/model/pokok-respons';
import { PollenPreparationModel } from 'src/app/model/pollen-preparation-model';
import { QualityControlModel } from 'src/app/model/quality-control';
import { TandanResponse } from 'src/app/model/tandan-response';
import { AccountService, UserRole } from 'src/app/service/account.service';
import { TaskService } from 'src/app/service/task.service';
import { BaggingService } from 'src/app/service/tasks/bagging.service';
import { ControlPollinationService } from 'src/app/service/tasks/control-pollination.service';
import { DefectService } from 'src/app/service/tasks/defect.service';
import { HarvestService } from 'src/app/service/tasks/harvest.service';
import { PollenPreparationService } from 'src/app/service/tasks/pollen-preparation.service';
import { QualityControlService } from 'src/app/service/tasks/quality-control.service';
import { TandanService } from 'src/app/service/tasks/tandan.service';
import { TreeService } from 'src/app/service/tasks/tree.service';

@Component({
  selector: 'app-finished-task',
  templateUrl: './finished-task.page.html',
  styleUrls: ['./finished-task.page.scss'],
})
export class FinishedTaskPage implements OnInit {

  treeNumber:String;
  regNo:String;
  cycle:String;
  status:String;
  age:String;
  block:String;
  indicator:number;
  taskType:string;
  taskId:string;
  workerName:string;
  baggingWorkerName:string;
  defect:string;
  workerRemark:string;
  svRemark:string;
  treeType:string;
  pollenDiscarded:boolean;
  workerTask:string;
  pollenName:string;
  constructor(
    private activatedRoute:ActivatedRoute,
    private tandanService: TandanService,
    private baggingService: BaggingService,
    private cpService: ControlPollinationService,
    private qcService: QualityControlService,
    private harvestService: HarvestService,
    private accountService: AccountService,
    private treeService: TreeService,
    private taskService: TaskService,
    private defectService: DefectService,
    private datePipe: DatePipe,
    private pollenPrepService: PollenPreparationService,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if(params['tandanId']!=null){
        this._getTandanInfo(params['tandanId']);
      }
      if(params['taskType']!=null){
        this.taskType = (params['taskType']);
      }
      if(params['taskId']!=null){
        this.taskId = (params['taskId']);
      }

      if(this.taskId != null && this.taskType != null){
        this._getTaskInfo();
      }
    });
  }

  private _getTaskInfo(){
    if(this.taskType == 'Balut'){
      this.workerTask = 'Balut';
      this.baggingService.getById(this.taskId,(res:BaggingModel)=>{
        this._getTandanInfo(res.tandan_id.toString());
        if(this.accountService.getUserRole() == UserRole.penyelia_balut){
          this.workerRemark = res.catatan;
          this.svRemark = res.catatan_pengesah;
        }
        this._getUser(res.id_sv_balut);
        if(res.kerosakans_id != null){
          this._getDefect(parseInt(res.kerosakans_id));
        }
      });
    }else if(this.taskType == 'Pendebungaan Terkawal (CP)'){
      this.workerTask = 'Pendebungaan Terkawal';
      this.cpService.getById(this.taskId,(res:ControlPollinationModel)=>{
        this._getTandanInfo(res.tandan_id.toString());
        if(this.accountService.getUserRole() == UserRole.penyelia_balut){
          this.workerRemark = res.catatan;
          this.svRemark = res.catatan_pengesah;
          this._getUser(res.id_sv_cp);
        }
        if(res.kerosakan_id != null){
          this._getDefect(parseInt(res.kerosakan_id));
        }
        if(res.no_pollen != null){
          this._getPollenInfo(res.no_pollen!);
        }
      });
    }else if(this.taskType == 'Kawalan Kualiti (QC)'){
      this.workerTask = 'Kawalan Kualiti';
      this.qcService.getById(this.taskId,(res:QualityControlModel)=>{
        this._getTandanInfo(res.tandan_id.toString());
        if(this.accountService.getUserRole() == UserRole.penyelia_qc){
          this.workerRemark = res.catatan;
          this.svRemark = res.catatan_pengesah;
          this._getUser(res.id_sv_qc);
        }
        if(res.kerosakan_id != null){
          this._getDefect(parseInt(res.kerosakan_id));
        }
      });
    }else if(this.taskType == 'Tuai'){
      this.workerTask = 'Tuai';
      this.harvestService.getById(this.taskId,(res:HarvestModel)=>{
        this._getTandanInfo(res.tandan_id.toString());
        if(this.accountService.getUserRole() == UserRole.penyelia_tuai){
          this.workerRemark = res.catatan;
          this.svRemark = res.catatan_pengesah;
        }
        this._getUser(res.id_sv_harvest);
        if(res.kerosakan_id != null){
          this._getDefect(parseInt(res.kerosakan_id));
        }
      });
    }else if(this.taskType == InAppTaskCycle.pp){
      this.workerTask = '';
      this.pollenPrepService.getById(this.taskId,(res:PollenPreparationModel)=>{
        this._getTandanInfo(res.tandan_id.toString());
        this.workerRemark = res.catatan;
        this.svRemark = res.catatan_pengesah;
        this._getUser(res.id_sv_pollen);
        if(res.kerosakan_id != null){
          this._getDefect(res.kerosakan_id);
        }
      });
    }else if(this.taskType == 'Penggunaan Pollen'){
      this.workerTask = '';
      this.pollenPrepService.getById(this.taskId,(res:PollenPreparationModel)=>{
        this._getTandanInfo(res.tandan_id.toString());
        this.workerRemark = res.catatan;
        this.svRemark = res.catatan_pengesah;
        this._getUser(res.id_sv_pollen);
        this.pollenDiscarded = res.status_pollen == 'lupus';
        if(res.kerosakan_id != null){
          this._getDefect(res.kerosakan_id);
        }
      });
    }
  }

  private _getDefect(id:number){
    this.defectService.getById(id,(res:DefectModel)=>{
      this.defect = res.nama;
    });
  }

  private _getPollenInfo(id:String){
    this.pollenPrepService.getById(id,(res:PollenPreparationModel)=>{
      this.pollenName = res.pokok!.progeny + "-" + res.pokok!.no_pokok;
    });
  }

  private _getUser(id:number){
    this.taskService.getUserById(id).subscribe(
      (res:LoginResponseModel) => {
        this.workerName = res.nama;
      }
    );
  }

  private _getBaggingUsername(id:number){
    this.taskService.getUserById(id).subscribe(
      (res:LoginResponseModel) => {
        this.baggingWorkerName = res.nama;
      }
    );
  }

  async _getTandanInfo(tandanId:String){
    this.tandanService.getById(tandanId,(res:TandanResponse)=>{
      this.regNo = res.no_daftar;
      this.regNo = res.no_daftar;
      this.age = res.umur? res.umur.toString(): this._calculateAge(res.tarikh_daftar).toString();
      this.cycle = this._getCycleName(res)?.toUpperCase();
      this.status = res.status_tandan? res.status_tandan.toUpperCase():"-";
      this.indicator = this._getStage(res);
      this.treeService.getById(res.pokok_id.toString(),(treeRes:PokokResponse)=>{
        this.treeNumber = treeRes.progeny+"-"+treeRes.no_pokok;
        this.block = treeRes.blok;
        this.treeType = treeRes.jantina;
        this.baggingService.getByTandanId(
          parseInt(tandanId.toString()),
          (res2:BaggingModel[])=>{
            res2.forEach(el => {
              this._getBaggingUsername(el.id_sv_balut);
            });
          }
        );
      });
    });
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

  _getStage(res:TandanResponse):number{
    let retVal:number;
    if(res.kitaran == TandanCycle.bagging){
      retVal = 0;
    }else if(res.kitaran == TandanCycle.cp){
      if(res.status_tandan == 'aktif'){
        retVal = 2;
      }else{
        retVal = 1;
      }
    }else if(res.kitaran == TandanCycle.qc){
      retVal = 3
    }else if(res.kitaran == TandanCycle.harvest){
      if(res.status_tandan == 'aktif'){
        retVal = 5;
      }else{
        retVal = 4;
      }
    }else{
      retVal = 5;
    }

    return retVal;
  }

  _calculateAge(prvDate:string){
    let currentDate = Date.parse(this.datePipe.transform(Date.now(),"yyyy-MM-dd"));
    let prevDate = Date.parse(prvDate);
    let retVal = (currentDate - prevDate)/1000/60/60/24;
    return retVal;
  }

}
