import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { InAppTaskCycle } from '../common/inapp-task-cycle';
import { PollenPrepPhase } from '../common/pollen-preparation-phase';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(
    private router:Router,
  ) { }

  tandanVerification(
    taskId:String,
    taskType:InAppTaskCycle,
    expactedTandanId:String,
    redirect:String,
    var1:any = null,
  ){
    this.router.navigate(
      [
        'app/tabs/tab1/tandan-verification',
        {
          taskId:taskId,
          taskType:taskType,
          expactedTandanId:expactedTandanId,
          redirect:redirect,
          var1:var1,
        }
      ]
    );
  }

  updatePollenPrepTask(
    taskId:String,
    taskPhase:PollenPrepPhase,
  ){
    this.router.navigate(
      [
        'app/tabs/tab1/pollen-prep-task-status',
        {
          taskId:taskId,
          taskPhase:taskPhase,
        }
      ]
    );
  }
}
