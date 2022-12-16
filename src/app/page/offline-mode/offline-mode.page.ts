import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserContinueSelection } from 'src/app/component/continue-prompt/continue-prompt.component';
import { BaggingModel } from 'src/app/model/bagging';
import { DefectModel } from 'src/app/model/defect';
import { HarvestModel } from 'src/app/model/harvest';
import { OfflineBaggingModel } from 'src/app/model/offline-bagging';
import { OfflineControlPollinationModel } from 'src/app/model/offline-control-pollination';
import { PokokResponse } from 'src/app/model/pokok-respons';
import { QualityControlModel } from 'src/app/model/quality-control';
import { TandanResponse } from 'src/app/model/tandan-response';
import { User } from 'src/app/model/user';
import { ModalService } from 'src/app/service/modal.service';
import { OfflineModeService } from 'src/app/service/offline-mode.service';
import { OfflineBaggingService } from 'src/app/service/offline/offline-bagging.service';
import { OfflineControlPollinationService } from 'src/app/service/offline/offline-control-pollination.service';
import { OfflineDefectService } from 'src/app/service/offline/offline-defect.service';
import { OfflineQcService } from 'src/app/service/offline/offline-qc.service';
@Component({
  selector: 'app-offline-mode',
  templateUrl: './offline-mode.page.html',
  styleUrls: ['./offline-mode.page.scss'],
})
export class OfflineModePage implements OnInit {

  isOfflineMode:Boolean = false;
  treeList:PokokResponse[] = [];
  tandanList:TandanResponse[] = [];
  baggingSvList:User[] = [];
  newCPTaskList:BaggingModel[] = [];
  newQcTaskList:QualityControlModel[] = [];
  newHarvestTaskList:HarvestModel[] = [];
  baggingTaskDone:OfflineBaggingModel[] = [];
  qcTaskDone:OfflineBaggingModel[] = [];
  cpTaskDone:OfflineControlPollinationModel[] = [];
  defectList:DefectModel[] = [];
  constructor(
    private offlineModeService:OfflineModeService,
    private router:Router,
    private modalService:ModalService,
    private offlineBaggingService:OfflineBaggingService,
    private offlineDefectService:OfflineDefectService,
    private offlineCPService:OfflineControlPollinationService,
    private offlineQcService:OfflineQcService,
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
          this.modalService.textAndBtnPrompt('Applikasi akan di mula semula','OK').then(
            (value)=>{
              window.location.replace('');
            }
          );
        }, 500);
      }else if(user_selection == UserContinueSelection.no){
      }
    });
  }

  private async _refreshData(){
    this.isOfflineMode = await this.offlineModeService.isOfflineMode();
    this.treeList = await this.offlineModeService.getTreeList();
    this.tandanList = await this.offlineModeService.getTandanList();
    this.baggingSvList = await this.offlineModeService.getBaggingSvList();
    this.newCPTaskList = await this.offlineModeService.getNewCpList();
    this.newQcTaskList = await this.offlineModeService.getNewQcList();
    this.baggingTaskDone = await this.offlineBaggingService.getSavedBaggingTasks();
    this.baggingTaskDone = await this.offlineQcService.getSavedQcTasks();
    this.newHarvestTaskList = await this.offlineModeService.getNewHarvestList();
    if(this.baggingTaskDone == null){
      this.baggingTaskDone = [];
    }
    this.cpTaskDone = await this.offlineCPService.getSavedCPTasks();
    if(this.cpTaskDone == null){
      this.cpTaskDone = [];
    }
    this.defectList = await this.offlineDefectService.getAll();
    if(this.defectList == null){
      this.defectList = [];
    }
  }

  back(){
    this.router.navigateByUrl('/app/tabs/tab1',{
      replaceUrl : true
    });
  }

}
