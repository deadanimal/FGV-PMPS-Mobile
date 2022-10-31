import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register-status',
  templateUrl: './register-status.page.html',
  styleUrls: ['./register-status.page.scss'],
})
export class RegisterStatusPage implements OnInit {

  regNumber:String;
  cycle:String;
  status:String;
  age:String;

  constructor() { }

  ngOnInit() {
    this.regNumber = "22C 0061 25C1";
    this.cycle = "Balut";
    this.status="Pass";
    this.age="140 Hari"
  }

}
