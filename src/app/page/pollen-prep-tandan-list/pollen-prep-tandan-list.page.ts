import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TandanResponse } from 'src/app/model/tandan-response';
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
    private router:Router,
    private activatedRoute:ActivatedRoute,
    private tandanService:TandanService,
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
    //todo: scanQR first
    this._verifyAndStartWork(tandanId);
  }

  _verifyAndStartWork(tandanId){
    this.router.navigate(
      [
        'app/tabs/tab1/defect',
        {
          taskType:'pollen-prep',
          status:this.taskStatus,
          taskStatus:this.taskStatus,
          tandanId:tandanId,
        }
      ]
    );
  }

  _getTandanByTreeId(){
    this.tandanService.getAll((res:[TandanResponse])=>{
      res.forEach(el => {
        if(el.pokok_id?.toString() == this.treeId){
          this.tandanList.push(el);
        }
      });
    });
  }

}
