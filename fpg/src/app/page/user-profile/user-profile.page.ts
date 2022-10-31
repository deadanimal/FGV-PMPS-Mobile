import { Component, OnInit } from '@angular/core';
import { LoginResponseModel } from 'src/app/model/login-response';
import { AccountService } from 'src/app/service/account.service';

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

  constructor(
    private accountService:AccountService
  ) { }

  ngOnInit() {
    let loginDetails:LoginResponseModel = this.accountService.getSessionDetails();
    this.name = loginDetails.nama;
    this.employeeId = loginDetails.no_kakitangan;
    this.email = loginDetails.email;
    this.date = loginDetails.created_at.toString();
    this.phone = loginDetails.no_telefon;
    this.role = loginDetails.peranan;
  }

}
