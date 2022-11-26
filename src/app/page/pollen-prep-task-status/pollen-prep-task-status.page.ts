import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PollenPrepPhase } from 'src/app/common/pollen-preparation-phase';
import { PollenPreparationModel } from 'src/app/model/pollen-preparation-model';
import { ModalService } from 'src/app/service/modal.service';
import { PollenPreparationService } from 'src/app/service/tasks/pollen-preparation.service';

@Component({
  selector: 'app-pollen-prep-task-status',
  templateUrl: './pollen-prep-task-status.page.html',
  styleUrls: ['./pollen-prep-task-status.page.scss'],
})
export class PollenPrepTaskStatusPage implements OnInit {

  firstHotRoomEnter:String;
  firstHotRoomExit:String;
  smash:String;
  secondHotRoomEnter:String;
  secondHotRoomExit:String;
  shive:String;
  qc:String;
  test:String;
  taskId:String;
  taskPhase:PollenPrepPhase;
  constructor(
    private activatedRoute:ActivatedRoute,
    private pollenPrepService:PollenPreparationService,
    private modalService:ModalService,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.taskId = params['taskId'];
      this.taskPhase = params['var1'];
    });
  }

  ionViewWillEnter(){
    this._submitTask();
  }


  _successPrompt(){
    let title = "Tarikh dan masa telah berjaya direkod, Sila tunggu 4 Jam untuk proses seterusnya"
    this.modalService.successPrompt(title);
  }

  _getPollenPrepUpdateField(){
    let retVal:Object;
    let date = new Date();
    let dateString = date.getFullYear() + "-" 
                    + (date.getMonth()+1) + "-"
                    + date.getDate() + " "
                    + date.getHours() + ":"
                    + date.getMinutes() + ":"
                    + date.getSeconds();
    if(this.taskPhase == PollenPrepPhase.HotRoomIn){
      this._successPrompt();
      retVal = {
        masa_masuk_pertama : dateString
      }
    }else if(this.taskPhase == PollenPrepPhase.HotRoomOut){
      retVal = {
        masa_keluar_pertama : dateString
      }
    }else if(this.taskPhase == PollenPrepPhase.Hit){
      retVal = {
        tarikh_ketuk : date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()
      }
    }else if(this.taskPhase == PollenPrepPhase.HotRoom2In){
      this._successPrompt();
      retVal = {
        masa_masuk_kedua : dateString
      }
    }else if(this.taskPhase == PollenPrepPhase.HotRoom2Out){
      retVal = {
        masa_keluar_kedua : dateString
      }
    }else if(this.taskPhase == PollenPrepPhase.Sieve){
      retVal = {
        tarikh_ayak : date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()
      }
    }else if(this.taskPhase == PollenPrepPhase.Qc){
      retVal = {
        tarikh_qc : date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()
      }
    }else if(this.taskPhase == PollenPrepPhase.Test){
      retVal = {
        tarikh_uji : date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()
      }
    }

    return retVal;
  }

  _submitTask(){
    this.pollenPrepService.update(
      this.taskId,
      this._getPollenPrepUpdateField(),
      (res:PollenPreparationModel)=>{
        this.firstHotRoomEnter = res.masa_masuk_pertama;
        this.firstHotRoomExit = res.masa_keluar_pertama;
        this.smash = res.tarikh_ketuk;
        this.secondHotRoomEnter = res.masa_masuk_kedua;
        this.secondHotRoomExit = res.masa_keluar_kedua;
        this.shive = res.tarikh_ayak;
        this.qc = res.tarikh_qc;
        this.test = res.tarikh_uji;
      }
    );
  }
}