import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PollenPrepPhase } from 'src/app/common/pollen-preparation-phase';
import { PollenPreparationModel } from 'src/app/model/pollen-preparation-model';
import { ModalService } from 'src/app/service/modal.service';
import { PollenPreparationService } from 'src/app/service/tasks/pollen-preparation.service';

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
  constructor(
    private router:Router,
    private modalService:ModalService,
    private activatedRoute:ActivatedRoute,
    private pollenPrepService:PollenPreparationService,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.taskId = params['taskId'];
      this.tandanId = params['tandanId'];
    });
  }

  ionViewWillEnter(){
    this._getTask();
  }

  _successPrompt(){
    let title = "Tarikh dan masa telah berjaya direkod, Sila tunggu 4 Jam untuk proses seterusnya"
    this.modalService.successPrompt(title);
  }

  btnPress(buttonId:PollenPrepPhase){
    if(buttonId == PollenPrepPhase.HotRoomIn){
      this._successPrompt();
      this.btn0 = true;
    }else if(buttonId == PollenPrepPhase.HotRoomOut){
      if(this.btn0)
      this.btn1 = true;
    }else if(buttonId == PollenPrepPhase.Hit){
      if(this.btn1)
      this.btn2 = true;
    }else if(buttonId == PollenPrepPhase.HotRoom2In){
      this._successPrompt();
      if(this.btn2)
      this.btn3 = true;
    }else if(buttonId == PollenPrepPhase.HotRoom2Out){
      if(this.btn3)
      this.btn4 = true;
    }else if(buttonId == PollenPrepPhase.Sieve){
      if(this.btn4)
      this.btn5 = true;
    }else if(buttonId == PollenPrepPhase.Qc){
      if(this.btn5){
        this.router.navigate(
          [
            'app/tabs/tab1/defect',
            {
              taskType:'pollen-prep-form',
              returnPage:'pollen-prep-form',
            }
          ]
        );
        this.btn6 = true;
      }
    }else if(buttonId == PollenPrepPhase.Test){
      if(this.btn6)
      this.btn7 = true;
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
