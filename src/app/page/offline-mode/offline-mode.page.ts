import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserContinueSelection } from 'src/app/component/continue-prompt/continue-prompt.component';
import { ModalService } from 'src/app/service/modal.service';
import { OfflineModeService } from 'src/app/service/offline-mode.service';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-offline-mode',
  templateUrl: './offline-mode.page.html',
  styleUrls: ['./offline-mode.page.scss'],
})
export class OfflineModePage implements OnInit {

  isOfflineMode:Boolean = false;
  constructor(
    private offlineModeService:OfflineModeService,
    private router:Router,
    private modalService:ModalService,
  ) { }

  async ngOnInit() {
    setTimeout(async () => {
      this.isOfflineMode = await this.offlineModeService.isOfflineMode();
    }, 500);
  }

  sync(){
    this.offlineModeService.sync();
  }

  offline(start){
    let prompt = start? 'Hidupkan Mod Offline?' : 'Matikan Mod Offline?'
    this.modalService.yesNoPrompt(prompt).then((value)=>{
      let user_selection:UserContinueSelection = value['data'];
      if(user_selection == UserContinueSelection.yes){
        this.offlineModeService.sync();
        this.offlineModeService.OfflineMode(start);
        setTimeout(async () => {
          this.isOfflineMode = await this.offlineModeService.isOfflineMode();
        }, 500);
      }else if(user_selection == UserContinueSelection.no){
      }
    });
  }

  back(){
    this.router.navigateByUrl('/app/tabs/tab1',{
      replaceUrl : true
    });
  }

}
