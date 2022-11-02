import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginResponseModel } from 'src/app/model/login-response';
import { AccountService } from 'src/app/service/account.service';
import { StorageService } from 'src/app/service/storage.service';

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
    private storageService:StorageService,
    private router:Router,
  ) { }

  ngOnInit() {
    if(this.accountService.getSessionDetails() == null){
      setTimeout(() => {
        this._getFromStorage();
      }, 500);
    }else{
      let loginDetails:LoginResponseModel = this.accountService.getSessionDetails();
      this.name = loginDetails.nama;
      this.id = loginDetails.no_kakitangan;
      this.role = loginDetails.peranan;
    }
  }

  async _getFromStorage(){
    const loginDetails = await this.storageService.get(this.storageService.loginDetail);
    console.log(loginDetails);
    this.accountService.saveAsSessionDetails(loginDetails);
    this.name = loginDetails.nama;
    this.id = loginDetails.no_kakitangan;
    this.role = loginDetails.peranan;
  }

  logout(){
    this.storageService.eraseAll();
    this.router.navigateByUrl('/login',{
      replaceUrl : true
    });
  }

}
