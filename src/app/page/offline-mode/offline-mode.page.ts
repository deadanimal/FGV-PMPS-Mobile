import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserContinueSelection } from 'src/app/component/continue-prompt/continue-prompt.component';
import { PokokResponse } from 'src/app/model/pokok-respons';
import { TandanResponse } from 'src/app/model/tandan-response';
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
  treeList:PokokResponse[] = [];
  tandanList:TandanResponse[] = [];
  constructor(
    private offlineModeService:OfflineModeService,
    private router:Router,
    private modalService:ModalService,
  ) { }

  async ngOnInit() {
    setTimeout( () => {
      this._refreshData();
    }, 500);
  }

  sync(){
    this.offlineModeService.sync();
    setTimeout(async () => {
      this._refreshData();
    }, 500);
  }

  offline(start){
    let prompt = start? 'Hidupkan Mod Offline?' : 'Matikan Mod Offline?'
    this.modalService.yesNoPrompt(prompt).then((value)=>{
      let user_selection:UserContinueSelection = value['data'];
      if(user_selection == UserContinueSelection.yes){
        this.offlineModeService.sync();
        this.offlineModeService.OfflineMode(start);
        setTimeout(async () => {
          this._refreshData();
        }, 500);
      }else if(user_selection == UserContinueSelection.no){
      }
    });
  }

  private async _refreshData(){
    this.isOfflineMode = await this.offlineModeService.isOfflineMode();
    this.treeList = await this.offlineModeService.getTreeList();
    this.tandanList = await this.offlineModeService.getTandanList();
    console.log("Finished")
  }

  back(){
    this.router.navigateByUrl('/app/tabs/tab1',{
      replaceUrl : true
    });
  }

}
