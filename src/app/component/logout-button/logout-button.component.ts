import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  ) { }

  ngOnInit() {
  }

  logout(){
    this.storageService.eraseAll();
    this.router.navigateByUrl('/login',{
      replaceUrl : true
    });
  }

}
