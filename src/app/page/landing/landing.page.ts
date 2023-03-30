import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/service/account.service';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {

  constructor(
    private router :Router,
    private storageService :StorageService,
    private accountService :AccountService,
    ) { }

  ngOnInit() {
    setTimeout(() => {
      this.checkForLoginDetails();
    }, 2000);
    
  }

  async checkForLoginDetails(){
    // this.router.navigate(
    //     ['/test-page'],
    //     {
    //       replaceUrl : true
    //     }
    //   );
    const loginDetail = await this.storageService.get(this.storageService.loginDetail);
    if(loginDetail!=null){
      this.accountService.saveAsSessionDetails(loginDetail);
      this.router.navigateByUrl(
        '/app/tabs/tab1',
        {
          replaceUrl : true
        }
      );
    }else{
    this.router.navigate(
      ['/login'],
      {
        replaceUrl : true
      }
      );
    }
  }

}
