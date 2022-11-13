import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/service/modal.service';

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
  btn8:boolean;
  btn9:boolean;
  PollenPrepPhase:PollenPrepPhase;
  constructor(
    private router:Router,
    private modalService:ModalService
  ) { }

  ngOnInit() {
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
    }else if(buttonId == PollenPrepPhase.HitIn){
      if(this.btn1)
      this.btn2 = true;
    }else if(buttonId == PollenPrepPhase.HitOut){
      if(this.btn2)
      this.btn3 = true;
    }else if(buttonId == PollenPrepPhase.HotRoom2In){
      this._successPrompt();
      if(this.btn3)
      this.btn4 = true;
    }else if(buttonId == PollenPrepPhase.HotRoom2Out){
      if(this.btn4)
      this.btn5 = true;
    }else if(buttonId == PollenPrepPhase.SieveIn){
      if(this.btn5)
      this.btn6 = true;
    }else if(buttonId == PollenPrepPhase.SieveOut){
      if(this.btn6)
      this.btn7 = true;
    }else if(buttonId == PollenPrepPhase.Qc){
      // if(this.btn7){
        this.router.navigate(
          [
            'app/tabs/tab1/defect',
            {
              taskType:'pollen-prep-form',
              returnPage:'pollen-prep-form',
            }
          ]
        );
        this.btn8 = true;
      // }
    }else if(buttonId == PollenPrepPhase.Test){
      // if(this.btn8)
      this.btn9 = true;
    }

  }

}
export enum PollenPrepPhase{
  HotRoomIn,
  HotRoomOut,
  HitIn,
  HitOut,
  HotRoom2In,
  HotRoom2Out,
  SieveIn,
  SieveOut,
  Qc,
  Test,
}
