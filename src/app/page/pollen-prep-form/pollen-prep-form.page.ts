import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InAppTaskCycle } from 'src/app/common/inapp-task-cycle';
import { PollenPrepPhase } from 'src/app/common/pollen-preparation-phase';
import { PollenPreparationModel } from 'src/app/model/pollen-preparation-model';
import { TandanResponse } from 'src/app/model/tandan-response';
import { ModalService } from 'src/app/service/modal.service';
import { NavigationService } from 'src/app/service/navigation.service';
import { PollenPreparationService } from 'src/app/service/tasks/pollen-preparation.service';
import { TandanService } from 'src/app/service/tasks/tandan.service';

@Component({
  selector: 'app-pollen-prep-form',
  templateUrl: './pollen-prep-form.page.html',
  styleUrls: ['./pollen-prep-form.page.scss'],
})
export class PollenPrepFormPage implements OnInit {

  btn0:boolean;
  btn1:boolean;
  btn2:boolean;
  btn3:boolean;
  btn4:boolean;
  btn5:boolean;
  btn6:boolean;
  btn7:boolean;
  taskId:String;
  tandanId:String;
  tandanReqNumber:String;
  qcDone:Boolean;
  constructor(
    private router:Router,
    private tandanService:TandanService,
    private activatedRoute:ActivatedRoute,
    private pollenPrepService:PollenPreparationService,
    private navService:NavigationService,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.taskId = params['taskId'];
      this.tandanId = params['tandanId'];
      this.qcDone = params['qcDone'];

      if(this.tandanId != null){
        this.getTandanInfo();
      }
    });
  }

  getTandanInfo(){
    this.tandanService.getById(this.tandanId,(res:TandanResponse)=>{
      this.tandanReqNumber = res.no_daftar;
    },false);
  }

  ionViewWillEnter(){
    if(this.qcDone){
      this._updateTask(PollenPrepPhase.Qc);
      this.navService.updatePollenPrepTask(this.taskId,PollenPrepPhase.Qc);
    }else{
      this._getTask();
    }
  }

  _updateTask(phase:PollenPrepPhase, nextUrl:String = 'app/tabs/tab1/pollen-prep-task-status'){
    this.navService.tandanVerification(this.taskId,InAppTaskCycle.pp,this.tandanId,nextUrl,phase);
  }

  btnPress(buttonId:PollenPrepPhase){
    if(buttonId == PollenPrepPhase.HotRoomIn){
      if(!this.btn0){
        this._updateTask(PollenPrepPhase.HotRoomIn);
      }
      this.btn0 = true;
    }else if(buttonId == PollenPrepPhase.HotRoomOut){
      if(this.btn0){
        if(!this.btn1){
          this._updateTask(PollenPrepPhase.HotRoomOut);
        }
        this.btn1 = true;
      }
    }else if(buttonId == PollenPrepPhase.Hit){
      if(this.btn1){
        if(!this.btn2){
          this._updateTask(PollenPrepPhase.Hit);
        }
        this.btn2 = true;
      }
    }else if(buttonId == PollenPrepPhase.HotRoom2In){
      if(this.btn2){
        if(!this.btn3){
          this._updateTask(PollenPrepPhase.HotRoom2In);
        }
        this.btn3 = true;
      }
    }else if(buttonId == PollenPrepPhase.HotRoom2Out){
      if(this.btn3){
        if(!this.btn4){
          this._updateTask(PollenPrepPhase.HotRoom2Out);
        }
        this.btn4 = true;
      }
    }else if(buttonId == PollenPrepPhase.Sieve){
      if(this.btn4){
        if(!this.btn5){
          this._updateTask(PollenPrepPhase.Sieve);
        }
        this.btn5 = true;
      }
    }else if(buttonId == PollenPrepPhase.Qc){
      if(this.btn5){
        this.router.navigate(
          [
            'app/tabs/tab1/defect',
            {
              taskType:InAppTaskCycle.pollenPrepForm,
              returnPage:'pollen-prep-form',
              tandanId:this.tandanId,
              taskId:this.taskId,
            }
          ]
        );
        this.btn6 = true;
      }
    }else if(buttonId == PollenPrepPhase.Test){
      if(this.btn6){
          this._updateTask(PollenPrepPhase.Test,'app/tabs/tab1/pollen-prep-test');
        this.btn7 = true;
      }
    }

  }

  _getTask(){
    this.pollenPrepService.getById(this.taskId,(res:PollenPreparationModel)=>{
      if(res.tarikh_uji){
        this.btn7 = true;
      }
      if(res.tarikh_qc){
        this.btn6 = true;
      }
      if(res.tarikh_ayak){
        this.btn5 = true;
      }
      if(res.masa_keluar_kedua){
        this.btn4 = true;
      }
      if(res.masa_masuk_kedua){
        this.btn3 = true;
      }
      if(res.tarikh_ketuk){
        this.btn2 = true;
      }
      if(res.masa_keluar_pertama){
        this.btn1 = true;
      }
      if(res.masa_masuk_pertama){
        this.btn0 = true;
      }
    });
  }

}
