import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { IonSelect } from '@ionic/angular';
import { TaskStatus } from 'src/app/common/task-status';
import { TreeType } from 'src/app/common/tree-type';
import { PokokResponse } from 'src/app/model/pokok-respons';
import { QcSearchResponse } from 'src/app/model/qc-search-response';
import { User } from 'src/app/model/user';
import { UserRole } from 'src/app/service/account.service';
import { BaggingService } from 'src/app/service/tasks/bagging.service';
import { TreeService } from 'src/app/service/tasks/tree.service';
import { UserService } from 'src/app/service/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-harvest-search-form',
  templateUrl: './harvest-search-form.page.html',
  styleUrls: ['./harvest-search-form.page.scss'],
})
export class HarvestSearchFormPage implements OnInit {

  @ViewChild("blockSelect") blockSelect!: IonSelect;
  @ViewChild("progenySelect") progenySelect!: IonSelect;
  @ViewChild("userSelect") userSelect!: IonSelect;
  searchResult:QcSearchResponse[] = [];
  blockNames:String[] = [];
  progenyNames:String[] = [];
  baggingWorkers:User[] = [];
  listOfBaggingWorkers:User[] = [];
  listOfTree:PokokResponse[] = [];
  firstTimeEnter:boolean;
  constructor(
    private baggingService:BaggingService,
    private router:Router,
    private treeService:TreeService,
    private userService:UserService,
  ) { }

  ngOnInit() {
    this.firstTimeEnter = true
  }

  ionViewDidEnter(){
    this.treeService.getAll(
      (res:[PokokResponse])=>{
        this.listOfTree = res;
        res.forEach(el => {
          if(!this.blockNames.includes(el.blok.trim())){
            this.blockNames.push(el.blok.trim());
          }
          if(!this.progenyNames.includes(el.progeny.trim())){
            this.progenyNames.push(el.progeny.trim());
          }
          }
        );
        this.userService.getByRole(UserRole.petugas_balut,(res1:[User])=>{
          this.baggingWorkers = res1;
          this.listOfBaggingWorkers = this.baggingWorkers;
        });
      }
    );
    if(!this.firstTimeEnter){
      this.submit(null);
    }else{
      this.firstTimeEnter = false;
    }
  }

  submit(form:NgForm){
    this.searchResult = [];
    this.baggingService.searchByTreeInfo2(
      this.blockSelect?.value?.toString(),
      this.progenySelect?.value?.toString(),
      this.userSelect?.value?.toString(),
      (res:[QcSearchResponse])=>{
        res.forEach(el => {
          if(( el.pokok.jantina == TreeType.Motherpalm && el.tandan.kitaran == 'kawal' && el.status == TaskStatus.verified) && el.tandan.status_tandan == 'aktif'){
            const differenceInDays: number = this.getDaysPassed(el);
            if(differenceInDays >= environment.harvestStartDelay){
              el.tandan.kitaran = "Tuai";
              this.searchResult.push(el);
            }
          }else if(( el.pokok.jantina == TreeType.Fatherpalm && el.tandan.kitaran == 'balut') && el.tandan.status_tandan == 'aktif'){
            el.tandan.kitaran = "Tuai";
            this.searchResult.push(el);
          }
        });
      }
    );
  }

  selectTask(taskId:number){
    this.router.navigate(
      [
        '/app/tabs/tab1/harvest-task-distribution',
        {
          taskId:taskId,
          taskIdCycle:'debung',
        }
      ]
    );
  }

  blockSelectEvent(event){
    if(event.detail.value!=null){
      this.progenyNames = [];
      this.baggingWorkers = [];
      this.listOfTree.forEach(el => {
        if(el.blok == event.detail.value){
          if(!this.progenyNames.includes(el.progeny.trim())){
            this.progenyNames.push(el.progeny.trim());
          }
        }
      });
      this.listOfBaggingWorkers.forEach(el=>{
        if(el.blok.includes(event.detail.value)){
          this.baggingWorkers.push(el);
        }
      });
    }
  }

  private getDaysPassed(el: any) {
    let baggedAt = new Date(Date.parse(el.created_at));
    let currentTime = new Date();
    baggedAt.setHours(0);
    baggedAt.setMinutes(0);
    baggedAt.setSeconds(0);
    baggedAt.setMilliseconds(0);

    currentTime.setHours(0);
    currentTime.setMinutes(0);
    currentTime.setSeconds(0);
    currentTime.setMilliseconds(0);

    // Calculate the difference in milliseconds
    const differenceInMilliseconds: number = Math.abs(currentTime.getTime() - baggedAt.getTime());
    // Calculate the difference in days
    const differenceInDays: number = differenceInMilliseconds / (1000 * 3600 * 24);
    return differenceInDays;
  }

}
