import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InAppTaskCycle } from 'src/app/common/inapp-task-cycle';
import { UserSelection } from 'src/app/component/scanner-prompt/scanner-prompt.component';
import { TandanResponse } from 'src/app/model/tandan-response';
import { ModalService } from 'src/app/service/modal.service';
import { OfflineModeService } from 'src/app/service/offline-mode.service';
import { OfflineTandanService } from 'src/app/service/offline/offline-tandan.service';
import { TandanService } from 'src/app/service/tasks/tandan.service';

@Component({
  selector: 'app-start-work-find',
  templateUrl: './start-work-find.page.html',
  styleUrls: ['./start-work-find.page.scss'],
})
export class StartWorkFindPage implements OnInit {

  treeNumber:String;
  regNumber:String;
  tandanId:String;
  taskId:String;
  taskType:String;
  scanned = false;
  isOfflineMode = false;

  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private modalService:ModalService,
    private tandanService:TandanService,
    private offlineModeService:OfflineModeService,
    private offlineTandanService:OfflineTandanService,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if(params['treeNum']!=null){
       this.treeNumber = params['treeNum'];
      }
      if(params['scanInput']!=null){
        this.tandanId = params['scanInput'];
        this.scanned = true;
      }
      if(params['taskId']!=null){
        this.taskId = params['taskId'];
      }
      if(params['taskType']!=null){
        this.taskType = params['taskType'];
      }
      if(params['task']!=null){
        this.taskType = params['task'];
      }
      if(params['tandanId']!=null){
        this.tandanId = params['tandanId'];
      }
    });
  }

  async ionViewDidEnter(){
    this.isOfflineMode = await this.offlineModeService.isOfflineMode();
    if(this.scanned){
      this._getRegNumber();
    }
  }

  submit(form:NgForm){
    if(this.taskType == InAppTaskCycle.pp){
      this.router.navigate(
        [
          'app/tabs/tab1/defect',
          {
            taskType:InAppTaskCycle.pp,
            status:'new',
            taskStatus:'new',
            tandanId:this.tandanId,
          }
        ],
        {
          replaceUrl : true
        }
      );
    }else{
      if(this.regNumber!=null && this.regNumber!=""){
        this.router.navigate(
          [
            'app/tabs/tab1/task-status',
            {
              taskId:this.taskId,
              regNumber:this.regNumber,
              treeNumber:this.treeNumber,
              taskType:this.taskType,
            }
          ],
          {
            replaceUrl : true
          }
        );
      }
    }
  }

  promptScan(){
    this.modalService.qrPrompt("No Daftar").then(
      (value)=>{
        let sel:UserSelection;
        sel = value['data'];
        if(sel == UserSelection.manual){
          this._manualInput();
        }else{
          this.router.navigate(
            [
              '/app/tabs/tab2',
              {
                taskId:this.taskId,
                returnUrl:"/app/tabs/tab1/start-work-find",
                treeNum:this.treeNumber,
                task:this.taskType,
              }
            ],
            {
              replaceUrl : true
            }
          );
        }
    });
  }

  _manualInput(){
    this.modalService.singleInput("No Daftar").then(
      (value)=>{
        let form:NgForm;
        form = value['data'];
        this.regNumber = form.value.value;
      }
    );
  }

  async _getRegNumber(){
    if(!this.isOfflineMode){
      this.tandanService.getById(this.tandanId,(res:TandanResponse)=>{
        if(res.pokok_id != null && (this.taskType == "Balut" || this.taskType == "balut")){
          this.modalService.textAndBtnPrompt("Tandan telah didaftar, Sila guna QR lain","OK");
        }else{
          this.regNumber = res.no_daftar;
        }
      });
    }else{
      let tandanInfo = await this.offlineTandanService.getById(parseInt(this.tandanId.toString()));
      if(tandanInfo.pokok_id != null && (this.taskType == "Balut" || this.taskType == "balut")){
        this.modalService.textAndBtnPrompt("Tandan telah didaftar, Sila guna QR lain","OK");
      }else{
        this.regNumber = tandanInfo.no_daftar;
      }
    }
  }

  scanQr(){
    this.promptScan();
  }

}
