import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserSelection } from 'src/app/component/scanner-prompt/scanner-prompt.component';
import { BaggingTask } from 'src/app/model/bagging-task';
import { PokokResponse } from 'src/app/model/pokok-respons';
import { TaskResponseModel } from 'src/app/model/task-response';
import { AccountService, UserRole } from 'src/app/service/account.service';
import { ModalService } from 'src/app/service/modal.service';
import { BaggingService } from 'src/app/service/tasks/bagging.service';
import { TreeService } from 'src/app/service/tasks/tree.service';

@Component({
  selector: 'app-new-task-info',
  templateUrl: './new-task-info.page.html',
  styleUrls: ['./new-task-info.page.scss'],
})
export class NewTaskInfoPage implements OnInit {

  treeNumber:String;
  ancestor:String;
  progeny:String;
  status:String;
  block:String;
  breed:String;
  userRole:UserRole;
  scanInput:String;
  taskId:String;
  taskType:String;
  tasks:[TaskResponseModel];

  constructor(
    private router:Router,
    private activatedRoute:ActivatedRoute,
    private modalService:ModalService,
    private pokokService:TreeService,
    private baggingService:BaggingService,
    private accountService:AccountService,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if(params['scanInput']!=null){
       this.scanInput = params['scanInput'];
      //  todo: check for the scan qr code tree id, if ok proceed
      }
      if(params['taskId']!=null){
        this.taskId = params['taskId'];
      }if(params['taskType']!=null){
        this.taskType = params['taskType'];
      }if(params['task']!=null){
        this.taskType = params['task'];
      }
    });
    if(this.scanInput!=null && this.scanInput != ""){
      this._proceedToWork();
    }
  }

  ionViewDidEnter(){
    this._getTreeInfo();
    this.userRole = this.accountService.getUserRole();
  }

  submitTask(){
    this._promptQrScan();
  }

  _promptQrScan(){
    this.modalService.qrPrompt("No Pokok").then(
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
                returnUrl:"app/tabs/tab1/new-task",
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

  _proceedToWork(){
    this.router.navigate(
      [
        '/app/tabs/tab1/reg-status',
        {
          taskId:this.taskId,
          treeNum:this.treeNumber,
          taskType:this.taskType,
        }
      ],
      {
        replaceUrl : true
      }
    );
  }

  _manualInput(){
    this.modalService.singleInput("No Pokok").then(
      (value)=>{
        let form:NgForm;
        form = value['data'];
        this.scanInput = form.value.value;
        if(this.scanInput!=null && this.scanInput != ""){
          this._proceedToWork();
        }
      }
    );
  }

  _getTreeInfo(){
    if("Pendebungaan Terkawal (CP)" == this.taskType){
      this.baggingService.getById(this.taskId,(res:BaggingTask)=>{
        this.pokokService.getById(res.pokok_id.toString(),(res:PokokResponse)=>{
          this.treeNumber = res.no_pokok;
          this.ancestor = res.induk;
          this.breed = res.baka;
          this.progeny = res.progeny;
          this.block = res.progeny;
          this.status = res.status_pokok;
        })
      });
    }
  }

}
