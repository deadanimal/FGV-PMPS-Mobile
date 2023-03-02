import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSelect } from '@ionic/angular';
import { PollenStatus } from 'src/app/common/pollen-status';
import { TaskStatus } from 'src/app/common/task-status';
import { BaggingModel } from 'src/app/model/bagging';
import { HarvestModel } from 'src/app/model/harvest';
import { PollenPreparationModel } from 'src/app/model/pollen-preparation-model';
import { ModalService } from 'src/app/service/modal.service';
import { NavigationService } from 'src/app/service/navigation.service';
import { BaggingService } from 'src/app/service/tasks/bagging.service';
import { HarvestService } from 'src/app/service/tasks/harvest.service';
import { PollenPreparationService } from 'src/app/service/tasks/pollen-preparation.service';

@Component({
  selector: 'app-pollen-prep-test',
  templateUrl: './pollen-prep-test.page.html',
  styleUrls: ['./pollen-prep-test.page.scss'],
})
export class PollenPrepTestPage implements OnInit {
  
  @ViewChild("id1") id1!: IonSelect;
  taskId:String;
  dateAndTimeTest:String;
  pollenType:String;
  dateAndTimeBagging:String;
  dateAndTimeHarvest:String;
  numberOfTest:String;
  pollenNo:string;
  tandan:string;

  constructor(
    private activatedRoute:ActivatedRoute,
    private modalService:ModalService,
    private pollenPrepService:PollenPreparationService,
    private baggingService:BaggingService,
    private router:Router,
    private datePipe:DatePipe,
    private harvestService:HarvestService,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.taskId = params['taskId'];
    });
  }
  
  ionViewDidEnter(){
    this._getTask();
  }

  _getTask(){
    this.pollenPrepService.getById(this.taskId,(res:PollenPreparationModel)=>{
      
      this.dateAndTimeTest = this.datePipe.transform(Date.now(), 'dd-MM-yyyy HH:mm:ss');
      this.pollenType = 'TUAI';
      this.pollenNo = res.pokok.progeny+'-'+res.pokok.no_pokok;
      this.tandan = res.tandan.no_daftar;
      this.dateAndTimeBagging = this.datePipe.transform(Date.now(), 'dd-MM-yyyy HH:mm:ss');
      this.dateAndTimeHarvest = this.datePipe.transform(Date.now(), 'dd-MM-yyyy HH:mm:ss');
      this.numberOfTest = res.bil_uji == null? '1':(parseInt(res.bil_uji)+1).toString();
      this.id1.value = res.viabiliti_pollen??"";
      this._getBaggingTask(res.tandan_id);
      this._getharvestTask(res.tandan_id);
    });
  }

  _getBaggingTask(tandanId){
    this.baggingService.getByTandanId(tandanId,(res:BaggingModel[])=>{
      res.forEach(el => {
        if(el.status == TaskStatus.verified){
          this.dateAndTimeBagging = this.datePipe.transform(el.updated_at, 'dd-MM-yyyy HH:mm:ss');
        }
      });
    },false);
  }

  _getharvestTask(tandanId){
    this.harvestService.getByTandanId(tandanId,(res:HarvestModel[])=>{
      res.forEach(el => {
        if(el.status == TaskStatus.verified){
          this.dateAndTimeHarvest = this.datePipe.transform(el.updated_at, 'dd-MM-yyyy HH:mm:ss');
        }
      });
    },false);
  }

  save(){
    let date = new Date();
    let minute:String = date.getMinutes() < 10? ("0"+date.getMinutes()): date.getMinutes().toString();
    let hour:String = date.getHours() < 10? ("0"+date.getHours()): date.getHours().toString();
    this.pollenPrepService.update(this.taskId,
      {
        bil_uji : this.numberOfTest,
        tarikh_uji : date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate(),
        masa_uji : hour + ":"+ minute + ":"+ date.getSeconds(),
        viabiliti_pollen : this.id1?.value
      },
      (res:PollenPreparationModel)=>{
        this.modalService.successPrompt("Borang Viability Check telah berjaya disimpan").then(
          (value)=>{
            setTimeout(
              () => {
                this.router.navigate(
                  [
                    'app/tabs/tab1/'
                  ]
                );
              },
              200
            );
          }
        );
      });
  }

  submit(){
    let date = new Date();
    let minute:String = date.getMinutes() < 10? ("0"+date.getMinutes()): date.getMinutes().toString();
    let hour:String = date.getHours() < 10? ("0"+date.getHours()): date.getHours().toString();
    this.pollenPrepService.update(this.taskId,
      {
        bil_uji : this.numberOfTest,
        tarikh_uji : date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate(),
        masa_uji : hour + ":"+ minute + ":"+ date.getSeconds(),
        viabiliti_pollen : this.id1?.value,
        status : TaskStatus.done,
        status_pollen : PollenStatus.qc3,
      },
      (res:PollenPreparationModel)=>{
        this.modalService.successPrompt("Borang Viability Check telah berjaya dihantar kepada Penyelia").then(
          (value)=>{
            setTimeout(
              () => {
                this.router.navigate(
                  [
                    'app/tabs/tab1/'
                  ]
                );
              },
              200
            );
          }
        );
      });
  }

}
