import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ModalService } from 'src/app/service/modal.service';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-logout-button',
  templateUrl: './logout-button.component.html',
  styleUrls: ['./logout-button.component.scss'],
})
export class LogoutButtonComponent implements OnInit {

  canBack:Boolean;

  constructor(
    private storageService:StorageService,
    private router:Router,
    private modalService:ModalService,
    private navCtrl:NavController,
  ) { }

  ngOnInit() {
    this.canBack = false;
    if(this.router.url != '/app/tabs/tab1' && this.router.url != '/app/tabs/tab3'){
      this.canBack = true;
    }
  }

  back(){
    try{
      this.navCtrl.pop();
    }catch{
      this.navCtrl.navigateBack('/app/tabs/tab1');
    }
  }

  async promptMenu(){
    this.modalService.menuPrompt().then(
      async (value)=>{
        if(value['data'] == 'logOut'){
          this.storageService.eraseAll();
          this.router.navigateByUrl('/login',{
            replaceUrl : true
          });
        }else if(value['data'] == 'dashboard'){
          this.router.navigate(['app/tabs/tab1/'],{
            replaceUrl : true
          });
        }else if(value['data'] == 'exit'){
          navigator['app'].exitApp();
        }
      }
    );
  }



}
