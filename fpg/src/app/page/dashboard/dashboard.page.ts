import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/service/account.service';
import { LoginResponseModel } from 'src/app/model/login-response';
import { StorageService } from 'src/app/service/storage.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  username:String;
  employeeId:String;
  role:String;

  constructor(
    private router:Router,
    private accountService:AccountService,
    private storageService:StorageService,
  ) { }

  ngOnInit() {
    let loginDetails:LoginResponseModel = this.accountService.getSessionDetails();
    this.username = loginDetails.nama;
    this.employeeId = loginDetails.no_kakitangan;
    this.role = loginDetails.peranan;
  }

  task(task:String){
    this.router.navigate(['app/tabs/tab1/main-task',{task:task}]);
  }

  logout(){
    this.storageService.eraseAll();
    this.router.navigateByUrl('/login',{
      replaceUrl : true
    });
  }

}
