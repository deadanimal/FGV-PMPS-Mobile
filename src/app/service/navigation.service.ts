import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { InAppTaskCycle } from '../common/inapp-task-cycle';

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
  ){
    this.router.navigate(
      [
        'app/tabs/tab1/tandan-verification',
        {
          taskId:taskId,
          taskType:taskType,
          expactedTandanId:expactedTandanId,
          redirect:redirect,
        }
      ]
    );
  }
}
