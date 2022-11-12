import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
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
    private popoverController:PopoverController,
  ) { }

  ngOnInit() {
  }

  async logout(){
    this.storageService.eraseAll();
    let popoverCtrl = await this.popoverController.getTop();
    popoverCtrl.dismiss();
    this.router.navigateByUrl('/login',{
      replaceUrl : true
    });
  }

}
