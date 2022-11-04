import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-start-work-find',
  templateUrl: './start-work-find.page.html',
  styleUrls: ['./start-work-find.page.scss'],
})
export class StartWorkFindPage implements OnInit {

  treeNumber:String;
  regNumber:String;
  taskId:String;

  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
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
    });
  }

  submit(form:NgForm){
    this.router.navigate(['app/tabs/tab1/task-status',{taskId:this.taskId}]);
  }

  scanQr(){
    if(this.treeNumber!=null){
      this.router.navigate(
        ['/app/tabs/tab2',{treeNum:this.treeNumber,taskId:this.taskId}],
        {
          replaceUrl : true
        }
      );
    }else{
      this.router.navigate(
        ['/app/tabs/tab2',{taskId:this.taskId}],
        {
          replaceUrl : true
        }
      );
    }
  }

}
