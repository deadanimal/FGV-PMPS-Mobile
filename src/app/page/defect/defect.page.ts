import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-defect',
  templateUrl: './defect.page.html',
  styleUrls: ['./defect.page.scss'],
})
export class DefectPage implements OnInit {

  defect:string = "z";
  taskType:String;
  tandanId:String;
  taskStatus:String;
  returnPage:String;
  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
        this.taskType = params['taskType'];
        this.tandanId = params['tandanId'];
        this.taskStatus = params['taskStatus'];
        this.returnPage = params['returnPage'];
    });
  }

  handleChange(e) {
    this.defect = e.detail.value;
  }

  continue(){
    let path = '';
    if(this.taskType == 'pollen-prep'){
      path = 'app/tabs/tab1/task-status';
    }else{
      path = 'app/tabs/tab1/task-status';
    }
    this.router.navigate(
      [
        path,
        {
          tandanId:this.tandanId,
          taskType:'pollen-prep',
          tandanStatus:'ok',
          returnPage:this.returnPage,
        }
      ]
    );
  }

  reject(){
    let path = '';
    if(this.taskType == 'pollen-prep'){
      path = 'app/tabs/tab1/task-status';
    }else{
      path = 'app/tabs/tab1/task-status';
    }
    this.router.navigate(
      [
        path,
        {
          tandanId:this.tandanId,
          taskType:'pollen-prep',
          tandanStatus:'nok',
          returnPage:this.returnPage,
        }
      ]
    );
  }

}
