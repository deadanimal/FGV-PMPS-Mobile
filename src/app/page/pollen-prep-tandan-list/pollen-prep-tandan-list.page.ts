import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pollen-prep-tandan-list',
  templateUrl: './pollen-prep-tandan-list.page.html',
  styleUrls: ['./pollen-prep-tandan-list.page.scss'],
})
export class PollenPrepTandanListPage implements OnInit {

  taskStatus:String;
  constructor(
    private router:Router,
    private activatedRoute:ActivatedRoute,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if(params['taskStatus']!=null){
        this.taskStatus = params['taskStatus'];
      }
    });
  }

  startWork(tandanId){
    //todo: scanQR first
    this._verifyAndStartWork();
  }

  _verifyAndStartWork(){
    this.router.navigate(
      [
        'app/tabs/tab1/defect',
        {
          taskType:'pollen-prep',
          status:this.taskStatus,
          taskStatus:this.taskStatus
        }
      ]
    );
  }

}
