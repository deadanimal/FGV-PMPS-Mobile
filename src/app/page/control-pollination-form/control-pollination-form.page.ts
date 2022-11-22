import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ControlPollinationTask } from 'src/app/model/control-pollination-task';
import { ModalService } from 'src/app/service/modal.service';
import { ControlPollinationService } from 'src/app/service/tasks/control-pollination.service';

@Component({
  selector: 'app-control-pollination-form',
  templateUrl: './control-pollination-form.page.html',
  styleUrls: ['./control-pollination-form.page.scss'],
})
export class ControlPollinationFormPage implements OnInit {

  pollenNumber:String;
  percentage:String;
  taskId:String;
  constructor(
    private activatedRoute:ActivatedRoute,
    private controlPollinationService:ControlPollinationService,
    private modalService:ModalService,
    private router:Router,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if(params['taskId']!=null){
        this.taskId = params['taskId'];
      }
    });
  }

  btnClick(form:NgForm){
    this.controlPollinationService.updatePollenNumber(this.taskId,this.pollenNumber,this.percentage,(res:ControlPollinationTask)=>{
      this.modalService.successPrompt("Borang Anda Telah Berjaya Dihantar Ke Penyelia").then(()=>{
        this.router.navigateByUrl(
          '/app/tabs/tab1',
          {
            replaceUrl : true
          }
        );
      });
    });
  }

}
