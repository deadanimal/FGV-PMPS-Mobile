import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LoginResponseModel } from 'src/app/model/login-response';
import { AccountService, UserRole } from 'src/app/service/account.service';

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
  roleShort:String;

  constructor(
    private accountService:AccountService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit() {
    let loginDetails:LoginResponseModel = this.accountService.getSessionDetails();
    this.name = loginDetails.nama;
    this.employeeId = loginDetails.no_kakitangan;
    this.email = loginDetails.email;
    this.date = this.datePipe.transform(Date.parse(loginDetails.created_at?.toString()),"dd-MM-YYYY");
    this.phone = loginDetails.no_telefon;
    this.role = loginDetails.peranan;

    if(this.role == UserRole.penyelia_qc){
      this.roleShort = "Penyelia QC";
    }else if(this.role == UserRole.petugas_balut){
      this.roleShort = "Petugas Balut";
    }else if(this.role == UserRole.penyelia_balut){
      this.roleShort = "Penyelia Balut";
    }else if(this.role == UserRole.petugas_qc){
      this.roleShort = "Petugas QC";
    }
  }

}
