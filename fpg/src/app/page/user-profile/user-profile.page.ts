import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {

  name:String;
  employeeId:String;
  email:String;
  date:String;
  phone:String;
  role:String;

  constructor() { }

  ngOnInit() {
    this.name = "Abu Bin Bakar";
    this.employeeId = "00110-090X-11FXGV";
    this.email = "aliabu@hotmail.com";
    this.date = "04/07/2022";
    this.phone = "012-3456789";
    this.role = "Penyelia";
  }

}
