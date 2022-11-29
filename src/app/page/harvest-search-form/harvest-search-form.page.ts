import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { IonSelect } from '@ionic/angular';
import { TreeType } from 'src/app/common/tree-type';
import { PokokResponse } from 'src/app/model/pokok-respons';
import { QcSearchResponse } from 'src/app/model/qc-search-response';
import { User } from 'src/app/model/user';
import { UserRole } from 'src/app/service/account.service';
import { BaggingService } from 'src/app/service/tasks/bagging.service';
import { TreeService } from 'src/app/service/tasks/tree.service';
import { UserService } from 'src/app/service/user.service';

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
  constructor(
    private baggingService:BaggingService,
    private router:Router,
    private treeService:TreeService,
    private userService:UserService,
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.treeService.getAll(
      (res:[PokokResponse])=>{
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
        });
      }
    );
  }

  submit(form:NgForm){
    this.baggingService.searchByTreeInfo(
      this.blockSelect?.value?.toString(),
      this.progenySelect?.value?.toString(),
      this.userSelect?.value?.toString(),
      (res:[QcSearchResponse])=>{
        res.forEach(el => {
          if(( el.pokok.jantina == TreeType.Motherpalm && el.tandan.kitaran == 'kawal') && el.tandan.status_tandan == 'aktif'){
            el.tandan.kitaran = "Kawalan Kualiti";
            this.searchResult.push(el);
          }else if(( el.pokok.jantina == TreeType.Fatherpalm && el.tandan.kitaran == 'balut') && el.tandan.status_tandan == 'aktif'){
            el.tandan.kitaran = "Balut";
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

}
