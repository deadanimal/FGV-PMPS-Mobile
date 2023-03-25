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

  constructor(
    private storageService:StorageService,
    private router:Router,
    private modalService:ModalService,
    private navCtrl:NavController,
  ) { }

  ngOnInit() {}

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
        }else if(value['data'] == 'back'){
          try{
            this.navCtrl.navigateBack('/app/tabs/tab1');
          }catch{
            this.navCtrl.navigateBack('/app/tabs/tab1');
          }
        }else if(value['data'] == 'sync'){
          this.router.navigate(['offline-mode']);
        }
      }
    );
  }



}
