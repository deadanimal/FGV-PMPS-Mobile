import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserSelection } from 'src/app/component/scanner-prompt/scanner-prompt.component';
import { TandanResponse } from 'src/app/model/tandan-response';
import { ModalService } from 'src/app/service/modal.service';
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

  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private modalService:ModalService,
    private tandanService:TandanService,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if(params['treeNum']!=null){
       this.treeNumber = params['treeNum'];
      }
      if(params['scanInput']!=null){
        this.tandanId = params['scanInput'];
        this._getRegNumber();
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
    });
  }

  submit(form:NgForm){
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
        ]
      );
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

  _getRegNumber(){
    this.tandanService.getById(this.tandanId,(res:TandanResponse)=>{
      this.regNumber = res.no_daftar;
    });
  }

  scanQr(){
    this.promptScan();
  }

}
