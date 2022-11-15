import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ControlPollinationTask } from 'src/app/model/control-pollination-task';
import { TandanResponse } from 'src/app/model/tandan-response';
import { ControlPollinationService } from 'src/app/service/tasks/control-pollination.service';
import { TandanService } from 'src/app/service/tasks/tandan.service';

@Component({
  selector: 'app-qc-search-form',
  templateUrl: './qc-search-form.page.html',
  styleUrls: ['./qc-search-form.page.scss'],
})
export class QcSearchFormPage implements OnInit {

  block:String;
  progeny:String;
  baggingWorker:String;
  searchResult:SearchResult[] = [];
  constructor(
    private tandanService:TandanService,
    private cpService:ControlPollinationService,
    private router:Router,
  ) { }

  ngOnInit() {
  }

  submit(form:NgForm){
    this.cpService.getByUserId(this.baggingWorker,(res:ControlPollinationTask[])=>{
      for(let i=0;i<res.length;i++){
        let el = res[i];
        this.tandanService.getById(el.tandan_id.toString(),(resTandan:TandanResponse)=>{
          if(resTandan.kitaran == 'debung'){
            this.searchResult.push({
              cycle:'Control Pollination',
              regNo:resTandan.no_daftar,
              taskId:el.id.toString(),
              treeNumber:resTandan.pokok_id.toString(),
            });
          }
        },false);
      }
    });
  }

  selectTask(taskId:String){
    this.router.navigate(
      [
        '/app/tabs/tab1/qc-task-distribution',
        {
          taskId:taskId,
        }
      ],
      {
        replaceUrl : true
      }
    );
  }
}

interface SearchResult{
  regNo:String,
  treeNumber:String,
  cycle:String,
  taskId:String,
}
