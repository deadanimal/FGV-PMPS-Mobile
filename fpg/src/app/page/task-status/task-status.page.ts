import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-task-status',
  templateUrl: './task-status.page.html',
  styleUrls: ['./task-status.page.scss'],
})
export class TaskStatusPage implements OnInit {

  name:String;
  treeId:String;
  regNo:String;
  date:String;
  remark:String;
  svRemark:String;

  constructor() { }

  ngOnInit() {
    this.name = "Muhammad Ali Bin Abu";
    this.treeId = "FJ2-35";
    this.regNo = "2C00065B2R";
    this.date = "04/07/2022";
    this.remark = "Aktif";
  }

}
