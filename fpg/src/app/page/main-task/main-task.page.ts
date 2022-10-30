import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-main-task',
  templateUrl: './main-task.page.html',
  styleUrls: ['./main-task.page.scss'],
})
export class MainTaskPage implements OnInit {

  task:String;
  disableFinishRecord:boolean;
  disableNewRecord:boolean;
  constructor(
    private activatedRoute:ActivatedRoute,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if(params['task']!=null){
        this.task = params['task'];
        if(params['task'] == "wrap"){
          this.task = "Balut";
        }else if(params['task'] == "cp"){
          this.task = "Pendebungaan Terkawal (CP)";
        }
      }
    });
  }

}
