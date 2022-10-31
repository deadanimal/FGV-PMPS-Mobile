import { Component, OnInit } from '@angular/core';
import { LoginResponseModel } from 'src/app/model/login-response';
import { AccountService } from 'src/app/service/account.service';

@Component({
  selector: 'app-user-info-header',
  templateUrl: './user-info-header.component.html',
  styleUrls: ['./user-info-header.component.scss'],
})
export class UserInfoHeaderComponent implements OnInit {

  name:String;
  id:String;
  role:String;

  constructor(
    private accountService:AccountService,
  ) { }

  ngOnInit() {
    let loginDetails:LoginResponseModel = this.accountService.getSessionDetails();
    this.name = loginDetails.nama;
    this.id = loginDetails.no_kakitangan;
    this.role = loginDetails.peranan;
  }


}
