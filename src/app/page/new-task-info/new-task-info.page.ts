import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskResponseModel } from 'src/app/model/task-response';

@Component({
  selector: 'app-new-task-info',
  templateUrl: './new-task-info.page.html',
  styleUrls: ['./new-task-info.page.scss'],
})
export class NewTaskInfoPage implements OnInit {

  treeNumber:String;
  ancestor:String;
  progeny:String;
  status:String;
  block:String;
  breed:String;
  userRole:String;
  tasks:[TaskResponseModel];

  constructor(
    private router:Router,
  ) { }

  ngOnInit() {
    this.tasks = [{
      aktiviti:"",
      created_at:"",
      id:0,
      jenis:"",
      petugas_id:1,
      status:"",
      tandan_id:1,
      tarikh:"10/10/2022",
      tarikh_pengesahan:"10/10/2022",
      updated_at:"10/10/2022",
    },];
    this.treeNumber = "FJ2-35";
    this.ancestor = "Fatherpalm";
    this.breed = "Platinum";
    this.progeny = "TK 46";
    this.block = "25C1";
    this.status = "Aktif";
    // let userInfo = this.accountService.getSessionDetails();
    this.userRole = "Pengguna";
    this.tasks.push({
      aktiviti:"",
      created_at:"",
      id:0,
      jenis:"",
      petugas_id:1,
      status:"",
      tandan_id:1,
      tarikh:"10/10/2022",
      tarikh_pengesahan:"10/10/2022",
      updated_at:"10/10/2022",
    });
  }

  submitTask(){
    // tab1/task-status
    this.router.navigate(['app/tabs/tab1/task-status']);
  }

}
