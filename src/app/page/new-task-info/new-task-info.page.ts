import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Route, Router, RouteReuseStrategy } from '@angular/router';
import { UserSelection } from 'src/app/component/scanner-prompt/scanner-prompt.component';
import { TaskResponseModel } from 'src/app/model/task-response';
import { AccountService } from 'src/app/service/account.service';
import { ModalService } from 'src/app/service/modal.service';

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
  userRole:String;
  scanInput:String;
  taskId:String;
  tasks:[TaskResponseModel];

  constructor(
    private router:Router,
    private activatedRoute:ActivatedRoute,
    private modalService:ModalService,
  ) { }

  ngOnInit() {
    this.treeNumber = "FJ2-35";
    this.ancestor = "Fatherpalm";
    this.breed = "Platinum";
    this.progeny = "TK 46";
    this.block = "25C1";
    this.status = "Aktif";
    this.userRole = "pekerja";
    this.activatedRoute.params.subscribe(params => {
      if(params['scanInput']!=null){
       this.scanInput = params['scanInput'];
      //  todo: check for the scan qr code tree id, if ok proceed
      }
      if(params['taskId']!=null){
        this.taskId = params['taskId'];
      }
    });
    if(this.scanInput!=null && this.scanInput != ""){
      this._proceedToWork();
    }
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
                returnUrl:"app/tabs/tab1/new-task"
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

}
