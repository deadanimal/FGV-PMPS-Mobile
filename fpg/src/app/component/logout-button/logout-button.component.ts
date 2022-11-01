import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/service/account.service';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-logout-button',
  templateUrl: './logout-button.component.html',
  styleUrls: ['./logout-button.component.scss'],
})
export class LogoutButtonComponent implements OnInit {

  constructor(
    private storageService:StorageService,
    private router:Router,
    private accountService:AccountService,
  ) { }

  ngOnInit() {
    if(this.accountService.getSessionDetails() == null){
      // this.logout();
    }
  }

  logout(){
    this.storageService.eraseAll();
    this.router.navigateByUrl('/login',{
      replaceUrl : true
    });
  }

}
