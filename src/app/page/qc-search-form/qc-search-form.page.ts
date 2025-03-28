import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { IonSelect, SelectChangeEventDetail } from '@ionic/angular';
import { LoginResponseModel } from 'src/app/model/login-response';
import { PokokResponse } from 'src/app/model/pokok-respons';
import { QcSearchResponse } from 'src/app/model/qc-search-response';
import { User } from 'src/app/model/user';
import { UserRole } from 'src/app/service/account.service';
import { BaggingService } from 'src/app/service/tasks/bagging.service';
import { TreeService } from 'src/app/service/tasks/tree.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-qc-search-form',
  templateUrl: './qc-search-form.page.html',
  styleUrls: ['./qc-search-form.page.scss'],
})
export class QcSearchFormPage implements OnInit {

  @ViewChild("blockSelect") blockSelect!: IonSelect;
  @ViewChild("progenySelect") progenySelect!: IonSelect;
  @ViewChild("userSelect") userSelect!: IonSelect;
  block:String;
  progeny:String;
  baggingWorker:String;
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
    this.baggingService.searchByTreeInfo(
      this.blockSelect?.value?.toString(),
      this.progenySelect?.value?.toString(),
      this.userSelect?.value?.toString(),
      (res:[QcSearchResponse])=>{
        res.forEach(el => {
          if(el.tandan.kitaran == 'debung' && el.tandan.status_tandan == 'aktif'){
            el.tandan.kitaran = "Pendebungaan Terkawal";
            this.searchResult.push(el);
          }
        });
      }
    );
  }

  selectTask(taskId:number){
    this.router.navigate(
      [
        '/app/tabs/tab1/qc-task-distribution',
        {
          taskId:taskId,
          taskIdCycle:'debung',
        }
      ]
    );
  }

  blockSelectEvent(event){
    this.block = event.detail.value;
    if(this.block!=null){
      this.progenyNames = [];
      this.baggingWorkers = [];
      this.listOfTree.forEach(el => {
        if(el.blok == this.block){
          if(!this.progenyNames.includes(el.progeny.trim())){
            this.progenyNames.push(el.progeny.trim());
          }
        }
      });
      this.listOfBaggingWorkers.forEach(el=>{
        if(el.blok.includes(this.block.toString())){
          this.baggingWorkers.push(el);
        }
      });
    }
  }

  progenySelectEvent(event){
    this.progeny = event.detail.value;
  }

  userSelectEvent(event){
    this.baggingWorker = event.detail.value;
  }
}
