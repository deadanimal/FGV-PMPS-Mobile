import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InAppTaskCycle } from 'src/app/common/inapp-task-cycle';
import { UserSelection } from 'src/app/component/scanner-prompt/scanner-prompt.component';
import { TandanResponse } from 'src/app/model/tandan-response';
import { ModalService } from 'src/app/service/modal.service';
import { TandanService } from 'src/app/service/tasks/tandan.service';

@Component({
  selector: 'app-tandan-verification',
  templateUrl: './tandan-verification.page.html',
  styleUrls: ['./tandan-verification.page.scss'],
})
export class TandanVerificationPage implements OnInit {

  regNumber:String;
  taskType:InAppTaskCycle;
  taskId:String;
  expactedRegNo:String;
  expactedTandanId:String;
  scanInput:String;
  redirect:String;
  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private modalService:ModalService,
    private tandanService:TandanService,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if(params['scanInput']!=null){
        this.scanInput = params['scanInput'];
      }
      if(params['taskId']!=null){
        this.taskId = params['taskId'];
      }
      if(params['taskType']!=null){
        this.taskType = params['taskType'];
      }
      if(params['expactedTandanId']!=null){
        this.expactedTandanId = params['expactedTandanId'];
      }
      if(params['redirect']!=null){
        this.redirect = params['redirect'];
      }
    });
  }

  ionViewDidEnter(){
    this._getExpectedRegNo();
    this._getRegNumber();
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
                returnUrl:"/app/tabs/tab1/tandan-verification",
                task:this.taskType,
                expactedTandanId:this.expactedTandanId,
                redirect:this.redirect,
              }
            ],
            {
              replaceUrl : true
            }
          );
        }
    });
  }

  _getRegNumber(){
    if(this.scanInput != null && this.scanInput != ''){
      this.tandanService.getById(this.scanInput,(res:TandanResponse)=>{
        this.regNumber = res.no_daftar;
      });
    }
  }

  scanQr(){
    this.promptScan();
  }

  submit(form:NgForm){
    if(this.regNumber == this.expactedRegNo){
      this.router.navigate(
        [
          this.redirect,
          {
            taskType:this.taskType,
            taskId:this.taskId,
          }
        ]
      );
    }else{
      this.modalService.textAndBtnPrompt('Tandan salah',"OK");
    }
  }

  _getExpectedRegNo(){
    this.tandanService.getById(this.expactedTandanId,(res:TandanResponse)=>{
      this.expactedRegNo = res.no_daftar;
    });
  }

}
