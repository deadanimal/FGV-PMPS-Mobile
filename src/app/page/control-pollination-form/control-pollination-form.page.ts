import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSelect } from '@ionic/angular';
import { InAppTaskCycle } from 'src/app/common/inapp-task-cycle';
import { TaskStatus } from 'src/app/common/task-status';
import { ControlPollinationModel } from 'src/app/model/control-pollination';
import { OfflineControlPollinationModel } from 'src/app/model/offline-control-pollination';
import { ModalService } from 'src/app/service/modal.service';
import { OfflineModeService } from 'src/app/service/offline-mode.service';
import { OfflineControlPollinationService } from 'src/app/service/offline/offline-control-pollination.service';
import { StorageService } from 'src/app/service/storage.service';
import { ControlPollinationService } from 'src/app/service/tasks/control-pollination.service';

@Component({
  selector: 'app-control-pollination-form',
  templateUrl: './control-pollination-form.page.html',
  styleUrls: ['./control-pollination-form.page.scss'],
})
export class ControlPollinationFormPage implements OnInit {

  @ViewChild("id1") id1!: IonSelect;
  pollenNumber:String;
  taskId:String;
  tandanId:String;
  taskType:String;
  isOfflineMode:boolean;
  constructor(
    private activatedRoute:ActivatedRoute,
    private controlPollinationService:ControlPollinationService,
    private modalService:ModalService,
    private router:Router,
    private offlineModeService:OfflineModeService,
    private offlineCPService:OfflineControlPollinationService,
    private storageService:StorageService,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if(params['taskId']!=null){
        this.taskId = params['taskId'];
      }if(params['tandanId']!=null){
        this.tandanId = params['tandanId'];
      }if(params['taskType']!=null){
        this.taskType = params['taskType'];
      }
    });
  }

  async ionViewDidEnter(){
    this.isOfflineMode = await this.offlineModeService.isOfflineMode();
  }

  async btnClick(form:NgForm){
    if(!this.isOfflineMode){
      this.controlPollinationService.updatePollenNumber(this.taskId,this.pollenNumber,this.id1?.value?.toString(),(res:ControlPollinationModel)=>{
        this.modalService.successPrompt("Borang Anda Telah Berjaya Dihantar Ke Penyelia").then(()=>{
          this.router.navigateByUrl(
            '/app/tabs/tab1',
            {
              replaceUrl : true
            }
            );
          });
        }
      );
    }else{
      if(this.taskType == InAppTaskCycle.rejectedCp){
        let tasks:OfflineControlPollinationModel[] = await this.offlineCPService.getSavedRedoCPTasks();
        tasks.forEach(el => {
          if(el.id == this.taskId){
            el.no_pollen = this.pollenNumber.toString();
            el.peratus_pollen=this.id1?.value?.toString();
            el.status=TaskStatus.done;
          }
        });
        this.storageService.set(this.storageService.redoCPOfflineData,tasks);
        this.modalService.successPrompt("Borang Anda Telah Berjaya Dihantar Ke Penyelia").then(()=>{
          this.router.navigateByUrl(
            '/app/tabs/tab1',
            {
              replaceUrl : true
            }
          );
        });
      }else if(this.taskType == InAppTaskCycle.posponedCp){
        let tasks:OfflineControlPollinationModel[] = await this.offlineCPService.getSavedPosponed2CPTasks();
        tasks.forEach(el => {
          if(el.id == this.taskId){
            el.no_pollen = this.pollenNumber.toString();
            el.peratus_pollen=this.id1?.value?.toString();
            el.status=TaskStatus.done;
          }
        });
        this.storageService.set(this.storageService.posponedCPOfflineData,tasks);
        this.modalService.successPrompt("Borang Anda Telah Berjaya Dihantar Ke Penyelia").then(()=>{
          this.router.navigateByUrl(
            '/app/tabs/tab1',
            {
              replaceUrl : true
            }
          );
        });
      }else{
        let tasks:OfflineControlPollinationModel[] = await this.offlineCPService.getSavedCPTasks();
        tasks.forEach(el => {
          if(el.tandan_id == this.tandanId){
            el.no_pollen = this.pollenNumber.toString();
            el.peratus_pollen=this.id1?.value?.toString();
            el.status=TaskStatus.done;
          }
        });
        this.storageService.set(this.storageService.controlPollinationOfflineData,tasks);
        this.modalService.successPrompt("Borang Anda Telah Berjaya Dihantar Ke Penyelia").then(()=>{
          this.router.navigateByUrl(
            '/app/tabs/tab1',
            {
              replaceUrl : true
            }
          );
        });
      }
    }
  }

}
