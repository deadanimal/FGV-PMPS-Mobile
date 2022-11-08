import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserSelection } from 'src/app/component/scanner-prompt/scanner-prompt.component';
import { ModalService } from 'src/app/service/modal.service';

@Component({
  selector: 'app-start-work-find',
  templateUrl: './start-work-find.page.html',
  styleUrls: ['./start-work-find.page.scss'],
})
export class StartWorkFindPage implements OnInit {

  treeNumber:String;
  regNumber:String;
  taskId:String;
  taskType:String;

  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private modalService:ModalService,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if(params['treeNum']!=null){
       this.treeNumber = params['treeNum'];
      }
      if(params['regNo']!=null){
        this.regNumber = params['regNo'];
      }
      if(params['taskId']!=null){
        this.taskId = params['taskId'];
      }
      if(params['taskType']!=null){
        this.taskType = params['taskType'];
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

  scanQr(){
    this.promptScan();
  }

}
