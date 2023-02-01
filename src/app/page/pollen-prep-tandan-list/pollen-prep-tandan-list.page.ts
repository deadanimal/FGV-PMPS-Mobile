import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InAppTaskCycle } from 'src/app/common/inapp-task-cycle';
import { TandanCycle } from 'src/app/common/tandan-cycle';
import { HarvestModel } from 'src/app/model/harvest';
import { TandanResponse } from 'src/app/model/tandan-response';
import { NavigationService } from 'src/app/service/navigation.service';
import { PollenPreparationService } from 'src/app/service/tasks/pollen-preparation.service';
import { TandanService } from 'src/app/service/tasks/tandan.service';

@Component({
  selector: 'app-pollen-prep-tandan-list',
  templateUrl: './pollen-prep-tandan-list.page.html',
  styleUrls: ['./pollen-prep-tandan-list.page.scss'],
})
export class PollenPrepTandanListPage implements OnInit {

  taskStatus:String;
  treeId:String;
  tandanList:TandanResponse[];
  constructor(
    private activatedRoute:ActivatedRoute,
    private tandanService:TandanService,
    private navService:NavigationService,
    private pollenPrepService:PollenPreparationService,
  ) { }

  ngOnInit() {
    this.tandanList = [];
    this.activatedRoute.params.subscribe(params => {
      if(params['taskStatus']!=null){
        this.taskStatus = params['taskStatus'];
      }
      if(params['treeId']!=null){
        this.treeId = params['treeId'];
      }
    });
  }

  ionViewWillEnter(){
    this.tandanList = [];
  }

  ionViewDidEnter(){
    this._getTandanByTreeId();
  }

  startWork(tandanId){
    this.navService.tandanVerification(
      null,
      InAppTaskCycle.pp,
      tandanId,
      "app/tabs/tab1/defect"
    );
  }

  _getTandanByTreeId(){
    let completedHarvestList:HarvestModel[] = [];
    this.pollenPrepService.getNewTask((res:[HarvestModel])=>{
      res.forEach(el => {
        if(el.pokok_id?.toString() == this.treeId){
          completedHarvestList.push(el);
        }
      });
      this.tandanService.getAll((res:[TandanResponse])=>{
        res.forEach(el => {
          completedHarvestList.forEach(harvestItem => {
            if(harvestItem.tandan_id == el.id){
                this.tandanList.push(el);
            }
          });
        });
      });
    });
  }

}
