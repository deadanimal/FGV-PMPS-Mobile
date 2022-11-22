import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { QcSearchResponse } from 'src/app/model/qc-search-response';
import { BaggingService } from 'src/app/service/tasks/bagging.service';

@Component({
  selector: 'app-qc-search-form',
  templateUrl: './qc-search-form.page.html',
  styleUrls: ['./qc-search-form.page.scss'],
})
export class QcSearchFormPage implements OnInit {

  block:String;
  progeny:String;
  baggingWorker:String;
  searchResult:QcSearchResponse[] = [];
  constructor(
    private baggingService:BaggingService,
    private router:Router,
  ) { }

  ngOnInit() {
  }

  submit(form:NgForm){
    this.baggingService.searchByTreeInfo(
      this.block,
      this.progeny,
      this.baggingWorker,
      (res:[QcSearchResponse])=>{
        res.forEach(el => {
          if(el.tandan.kitaran == 'debung' && el.tandan.status_tandan == 'aktif'){
            el.tandan.kitaran = "Pendebungaan Terkawal";
            this.searchResult.push(el);
          }
        });
      }
    );
  }

  selectTask(taskId:number){
    this.router.navigate(
      [
        '/app/tabs/tab1/qc-task-distribution',
        {
          taskId:taskId,
          taskIdCycle:'debung',
        }
      ],
      {
        replaceUrl : true
      }
    );
  }
}
