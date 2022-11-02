import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-finished-task',
  templateUrl: './finished-task.page.html',
  styleUrls: ['./finished-task.page.scss'],
})
export class FinishedTaskPage implements OnInit {

  treeNumber:String;
  regNo:String;
  cycle:String;
  status:String;
  age:String;
  constructor() { }

  ngOnInit() {
    this.treeNumber = "FJ2-35";
    this.regNo = "22C 0061 25C1";
    this.age = "140";
    this.cycle = "Balut";
    this.status = "Pass";
  }

}
